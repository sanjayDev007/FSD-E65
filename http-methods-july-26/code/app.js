const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(express.json());

// Helper to read users from db.json
function readUsers() {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    try {
        return JSON.parse(data).users || [];
    } catch {
        return [];
    }
}

// Helper to write users to db.json
function writeUsers(users) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users }, null, 2), 'utf-8');
}

// CREATE user
app.post('/users', (req, res) => {
    console.log('params: ',req.params.id);
    console.log('Query: ', req.query);
    console.log('Body: ', req.body);
    const users = readUsers();
    const newUser = { id: Date.now().toString(), ...req.body };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});

// READ single user
app.get('/users/:id', (req, res) => {
    console.log('params: ',req.params.id);
    console.log('Query: ', req.query);
    console.log('Body: ', req.body);
    const users = readUsers();
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// UPDATE user
app.put('/users/:id', (req, res) => {
    console.log('params: ',req.params.id);
    console.log('Query: ', req.query);
    console.log('Body: ', req.body);
    const users = readUsers();
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    users[idx] = { ...users[idx], ...req.body };
    writeUsers(users);
    res.json(users[idx]);
});

// PARTIAL UPDATE user (PATCH)
app.patch('/users/:id', (req, res) => {
    console.log('params: ', req.params.id);
    console.log('Query: ', req.query);
    console.log('Body: ', req.body);
    const users = readUsers();
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    users[idx] = { ...users[idx], ...req.body };
    writeUsers(users);
    res.json(users[idx]);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
    console.log('params: ',req.params.id);
    console.log('Query: ', req.query);
    console.log('Body: ', req.body);
    let users = readUsers();
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    const deleted = users.splice(idx, 1)[0];
    writeUsers(users);
    res.json(deleted);
});

// GET all users
app.get('/users', (req, res) => {
    console.log('params: ',req.params.id);
    console.log('Query: ', req.query);
    console.log('Body: ', req.body);
    const users = readUsers();
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});