const { checkAuth, requireRole } = require('../middlewares/checkAuth');
const productController = require('../controllers/productController');
const router = require('express').Router();


// products
router.get('/', productController.getAllProducts);
router.post('/', checkAuth, requireRole('admin', 'vendor'), productController.createProduct);
router.get('/vendor', checkAuth, requireRole('vendor'), productController.getProductsByVendor);

router.get('/:id', productController.getProductById);
router.put('/:id', checkAuth, requireRole('admin', 'vendor'), productController.updateProduct);
router.delete('/:id', checkAuth, requireRole('admin', 'vendor'), productController.deleteProduct);

module.exports = router;