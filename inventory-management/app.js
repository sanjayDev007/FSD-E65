const express = require('express');
const app = express();
const cors = require('cors');
const inventoryRoutes = require('./routes/inventory');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');

// Import routes
app.use('/', require('./routes/index'));
app.use('/api/inventory', inventoryRoutes);

app.listen(3000, () => {
  console.log('Server is running on port localhost:3000');
});