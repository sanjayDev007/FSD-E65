const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/entri').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const Inventory = mongoose.model('Inventory', inventorySchema);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
    } catch (error) {
    return res.status(500).send(error.message);
    }
});

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

app.get('/inventory', async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).send(inventory);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.post('/inventory', async (req, res) => {
    try {
        const item = await Inventory.create(req.body);
        res.status(201).send(item);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

app.put('/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req
.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.status(200).send(item);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

app.delete('/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.status(200).send('Item deleted successfully');
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});