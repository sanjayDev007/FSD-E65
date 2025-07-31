const router = require('express').Router();
const Inventory = require('../models/Inventory');

router.get('/', (req, res) => {
  try {
    const query = req.query;
    const items = Inventory.find(query);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching items',
      error: error.message
    });
  }
});


router.post('/', (req, res) => {
  try {
    let item = req.body;
    let inventory = Inventory.create(item);
    res.status(201).json({
      message: 'Item created successfully',
      item: inventory
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
})


router.put('/', (req, res) => {
  try {
    const { query, updates } = req.body;
    if (!query || !updates) {
      return res.status(400).json({ message: 'Query and updates are required' });
    }
    const updated = Inventory.update(query, updates);
    if (updated) {
      res.status(200).json({ message: 'Item updated successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error updating item',
      error: error.message
    });
  }
});

router.delete('/', (req, res) => {
  try {
    const query = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    const deleted = Inventory.delete(query);
    if (deleted) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting item',
      error: error.message
    });
  }
});

module.exports = router;