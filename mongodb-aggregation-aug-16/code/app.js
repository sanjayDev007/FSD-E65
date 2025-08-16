const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev')); // Logging middleware
app.use(cors());
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/entri', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema with indexes
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    age: Number,
    city: String,
    createdAt: { type: Date, default: Date.now }
});

// Single field index
userSchema.index({ email: 1 });

// Compound index
userSchema.index({ city: 1, age: -1 });

const User = mongoose.model('User', userSchema);

// Create User API
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Analytics API using aggregation
app.get('/api/users/analytics', async (req, res) => {
    try {
        // Example: Group users by city and get average age and count
        const analytics = await User.aggregate([
            {
                $group: {
                    _id: '$city',
                    avgAge: { $avg: '$age' },
                    totalUsers: { $sum: 1 }
                }
            },
            { $sort: { totalUsers: -1 } }
        ]);
        res.json(analytics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
