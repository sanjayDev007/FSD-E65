const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-super-secret-key-for-jwt-that-should-be-in-env-vars'; // Use a strong, random secret

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
        // Return a default structure if the file is corrupt or empty
        return { admins: [{ username: 'admin', password: 'password' }], foodItems: [] };
    }
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- MIDDLEWARE ---
app.use(express.json()); // Replaces bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Replaces bodyParser.urlencoded()
app.use('/public', express.static(path.join(__dirname, 'public')));


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


// --- ADMIN AUTHENTICATION MIDDLEWARE (CHECKS JWT) ---
const requireAdminLogin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // You can attach the decoded payload to the request if needed
        next();
    } catch (error) {
        res.status(403).send('Invalid token.');
    }
};

// --- ROUTES ---

// ## Admin Routes ##

// Admin Login - Creates and returns a JWT
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const admin = db.admins.find(a => a.username === username && a.password === password);

    if (admin) {
        // Create a JWT
        const token = jwt.sign(
            { username: admin.username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        );
        res.status(200).json({ message: 'Admin login successful', token: token });
    } else {
        res.status(401).send('Invalid admin credentials');
    }
});
// NOTE: A '/logout' endpoint is not needed with JWT. The client simply discards the token.

// Add a new food item (Protected by JWT)
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

// Update a food item (Protected by JWT)
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

// Delete a food item (Protected by JWT)
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