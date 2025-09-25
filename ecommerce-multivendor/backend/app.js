require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");

// Database connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/vendors', require('./routes/vendorRoute'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/admins', require('./routes/adminRoute'));
app.use('/api/customers', require('./routes/customerRoute'));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
