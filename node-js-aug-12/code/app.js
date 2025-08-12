const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/entri', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema & Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
});

const User = mongoose.model('User', userSchema);

// CRUD Routes

// Create User
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read All Users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Read Single User
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update User
app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete User
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/users/average-age-by-state', async (req, res) => {
    try {
        const result = await User.aggregate([
            { $group: { _id: "$state", averageAge: { $avg: "$age" } } }
        ]);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/', (req,res)=>{
    res.sendFile(__dirname + 'uploads/index.html');
} )

const imageSchema = new mongoose.Schema({
    path: String,
    description: String,
    tags: String
});

const Image = mongoose.model('Image', imageSchema);

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        let {description, tags} = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        await Image.create({ path: req.file.filename, description, tags });
        res.json({ message: 'File uploaded successfully', file: req.file });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});