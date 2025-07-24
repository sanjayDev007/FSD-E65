const Express = require('./core-express.js');
const DB = require('./db.js');
const app = new Express();
const db = new DB();

app.use(app.bodyParser());

app.get('/api/users', (req, res) => {
    let users = db.findMany(user => user && user.username);
    users = users.map(user => ({
        username: user.username
    }));
    if (users.length === 0) {
        return res.json({ message: 'No users found' });
    }

    res.json({ users });
});

app.post('/api/register', (req, res) => {
    let newUser = req.body;
    if (!newUser || !newUser.username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    if (!newUser.password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    if(db.get(newUser.username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    db.set(newUser.username, newUser);
    console.log(`User registered: ${newUser.username}`);
    res.json({ message: 'User created successfully', user: newUser});
});

app.post('/api/login', (req, res) => {
    let credentials = req.body;
    if (!credentials || !credentials.username || !credentials.password) {
        return res.json({ error: 'Username and password are required' });
    }
    let user = db.get(credentials.username);
    if (!user || user.password !== credentials.password) {
        return res.json({ error: 'Invalid username or password' });
    }
    console.log(`User logged in: ${credentials.username}`);
    res.json({ message: 'Login successful', user });

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});