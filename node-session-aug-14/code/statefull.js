const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');


const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/entri').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
});
const User = mongoose.model('User', userSchema);

// Session setup
app.use(
    session({
        secret: '2344cehrhueryu2u43',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/entri' }),
        cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
    })
);

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ username, password: hash });
        res.json({ message: 'User registered', user: { username: user.username } });
    } catch (err) {
        res.status(400).json({ message: 'User already exists' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User doesnt exist' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    req.session.userId = user._id;
    let token = req.session.id; // Using session ID as a token
    res.json({ message: 'Logged in', token, user: { username: user.username } });
});

// Middleware to protect routes
function isAuthenticated(req, res, next) {
    // Check session from cookie or session ID in header
    if (req.session && req.session.userId) return next();

    // Optionally support session ID via header (e.g., for APIs)
    const sessionId = req.headers['x-session-id'];
    if (sessionId) {
        // Manually load session from store
        req.sessionStore.get(sessionId, (err, session) => {
            if (err || !session || !session.userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            // Properly reconstruct the session object
            req.session = req.sessionStore.createSession(req, session);
            req.session.id = sessionId;
            return next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Protected route
app.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

// User info route
app.get('/userinfo', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.userId).select('username');
    res.json({ user });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out' });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});