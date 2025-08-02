const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json({ limit: '10mb' })); // Increase limit for large base64 images
app.use(express.urlencoded({ extended: true }));

const SECRET_KEY = 'your_secret_key'; // Use env variable in production

// JWT verification middleware
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Malformed token' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded user for demo
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username, role: "admin" }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to convert base64 image in req.body.image to file in images folder
const convertBase64ToImage = (req, res, next) => {
    const base64String = req.body.image;
    if (!base64String) return next(); // No image, skip

    // Ensure images folder exists
    const imagesDir = path.join(__dirname, 'images');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
    }

    // Generate unique filename
    const matches = base64String.match(/^data:image\/(\w+);base64,/);
    const ext = matches ? matches[1] : 'png';
    const filename = `image_${Date.now()}.${ext}`;
    const filePath = path.join(imagesDir, filename);

    // Remove base64 header if present
    const data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filePath, buffer);

    // Attach file path to request for downstream use
    req.savedImagePath = filePath;
    next();
};

app.get('/', verifyJWT, (req, res) => {
  res.send(`Hello, ${req.user.username}!`);
});
app.get('/home', verifyJWT, (req, res) => {
    res.send(`Hello, ${req.user.username}!`);
});
app.get('/dashboard', verifyJWT, (req, res) => {
    res.send(`Welcome to your dashboard, ${req.user.username}!`);
});
app.get('/profile', verifyJWT, (req, res) => {
    res.send(`This is the profile page for ${req.user.username}.`);
});
app.get('/settings', verifyJWT, (req, res) => {
    res.send(`Settings page for ${req.user.username}.`);
});
app.get('/about', verifyJWT, (req, res) => {
    res.send(`About page for ${req.user.username}.`);
});
app.get('/contact', verifyJWT, (req, res) => {
    res.send(`Contact page for ${req.user.username}.`);
});
app.get('/notifications', verifyJWT, (req, res) => {
    res.send(`Notifications for ${req.user.username}.`);
});

app.post('/upload', convertBase64ToImage, (req, res) => {
    if (!req.savedImagePath) {
        return res.status(400).json({ message: 'No image provided' });
    }
    res.json({ message: 'Image uploaded successfully', imagePath: req.savedImagePath });
});
app.listen(3000, () => {  console.log('Server is running on port 3000');});