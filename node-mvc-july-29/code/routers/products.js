const router = require('express').Router();

router.get('/', (req, res) => {
    res.json([
      { id: 1, name: 'Product A' },
      { id: 2, name: 'Product B' }
    ]);
  });
  
  router.get('/:id', (req, res) => {
    const productId = req.params.id;
  
      res.json({ id: productId, name: `Product ${productId}` });
  });


  module.exports = router;