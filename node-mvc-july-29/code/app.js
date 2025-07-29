const express = require('express');
const app = express();
const usersRouter = require('./routers/users');
const productsRouter = require('./routers/products');
const cartsRouter = require('./routers/carts'); // Cart routes
const PORT = process.env.PORT || 3000;

// ---------- Not Needed Now -----------
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/test'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
// ---------- Not Needed Now -----------


app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page', message: 'Welcome to the Home Page!' });
});

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


//CRUD - > Create, Read, Update, Delete


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});