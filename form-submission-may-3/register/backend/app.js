const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Array to store all requests
const requestHistory = [];

// Middleware
app.use(cors()); // Handle CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Request logger middleware (except for /requests route)
app.use((req, res, next) => {
    if (req.path !== '/requests') {
        const requestData = {
            method: req.method,
            url: req.url,
            body: req.body || {},
            query: req.query,
            timestamp: new Date().toISOString()
        };
        requestHistory.push(requestData);
        console.log(`${req.method} request to ${req.url}`);
    }
    next();
});

// Route handling
app.get('/', (req, res) => {
    res.json({ message: 'GET request received' });
});

app.post('/', (req, res) => {
    res.json({
        message: 'POST request received',
        data: req.body
    });
});

app.get('/requests', (req, res) => {
    res.json(requestHistory);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const port = 3210;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
