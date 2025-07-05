const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// --- DATABASE ---
const DB_FILE = './db.json';

const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ admins: [{ username: 'admin', password: 'password' }], foodItems: [] }));
    }
    const data = fs.readFileSync(DB_FILE);
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Error parsing database file:', error);
        return { admins: [{ username: 'admin', password: 'password' }], foodItems: [] };
    }
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// --- SESSION MIDDLEWARE SETUP ---
app.use(session({
    // It's crucial to change this secret to a long, random string in production
    secret: 'a-very-secret-key-that-should-be-in-env-vars',
    resave: false,
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: false, // Set to true if you are using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 24 hours
    }
}));


// --- MULTER SETUP FOR IMAGE UPLOAD ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// --- ADMIN AUTHENTICATION MIDDLEWARE (CHECKS SESSION) ---
const requireAdminLogin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(401).send('Unauthorized. Please login as admin first.');
    }
};

// --- ROUTES ---

// ## Admin Routes ##

// Admin Login - Creates the session
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const admin = db.admins.find(a => a.username === username && a.password === password);

    if (admin) {
        // Set a property on the session object
        req.session.isAdmin = true;
        res.status(200).send('Admin login successful');
    } else {
        res.status(401).send('Invalid admin credentials');
    }
});

// Admin Logout - Destroys the session
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out.');
        }
        // The cookie is typically cleared automatically, but this is a good practice
        res.clearCookie('connect.sid');
        res.status(200).send('Admin logout successful');
    });
});

// Protected route to check if admin is logged in
app.get('/api/admin/status', (req, res) => {
    if (req.session.isAdmin) {
        res.status(200).send({ isAdmin: true });
    }
    else {
        res.status(401).send({ isAdmin: false });
    }
});
// Add a new food item (Protected by session)
app.post('/api/food', requireAdminLogin, upload.single('image'), (req, res) => {
    const { name, recipe } = req.body;
    const image = req.file ? `/public/uploads/${req.file.filename}` : null;

    if (!name || !recipe || !image) {
        return res.status(400).send('Name, recipe, and image are required.');
    }

    const db = readDB();
    const newFoodItem = {
        id: Date.now(),
        name,
        recipe,
        image
    };
    db.foodItems.push(newFoodItem);
    writeDB(db);

    res.status(201).send(newFoodItem);
});

// Update a food item (Protected by session)
app.put('/api/food/:id', requireAdminLogin, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, recipe } = req.body;
    const db = readDB();
    const foodIndex = db.foodItems.findIndex(item => item.id == id);

    if (foodIndex === -1) {
        return res.status(404).send('Food item not found.');
    }

    const updatedFoodItem = {
        ...db.foodItems[foodIndex],
        name: name || db.foodItems[foodIndex].name,
        recipe: recipe || db.foodItems[foodIndex].recipe,
    };

    if (req.file) {
        updatedFoodItem.image = `/public/uploads/${req.file.filename}`;
    }

    db.foodItems[foodIndex] = updatedFoodItem;
    writeDB(db);

    res.status(200).send(updatedFoodItem);
});

// Delete a food item (Protected by session)
app.delete('/api/food/:id', requireAdminLogin, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const initialLength = db.foodItems.length;
    db.foodItems = db.foodItems.filter(item => item.id != id);

    if (db.foodItems.length === initialLength) {
        return res.status(404).send('Food item not found.');
    }

    writeDB(db);
    res.status(200).send({ message: 'Food item deleted successfully.' });
});

// ## User Routes ##

// Get all food items
app.get('/api/food', (req, res) => {
    const db = readDB();
    res.status(200).send(db.foodItems);
});

// Get a single food item
app.get('/api/food/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const foodItem = db.foodItems.find(item => item.id == id);



    if (foodItem) {
        res.status(200).send(foodItem);
    } else {
        res.status(404).send('Food item not found.');
    }
});

// --- SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Create public/uploads directory if it doesn't exist
    if (!fs.existsSync('./public/uploads')) {
        fs.mkdirSync('./public/uploads', { recursive: true });
    }
});