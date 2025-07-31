const router = require('express').Router();
const Inventory = require('../models/Inventory');

router.get('/', (req, res) => {
  const items = Inventory.find();
  res.render('index', { title: 'Inventory Management', items });
});

module.exports = router;