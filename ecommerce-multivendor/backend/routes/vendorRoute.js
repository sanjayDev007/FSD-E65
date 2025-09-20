const router = require('express').Router();

const vendorController = require('../controllers/vendorController');
const { checkAuth, requireRole } = require('../middlewares/checkAuth');

router.post('/login', vendorController.login);
router.get('/', checkAuth, requireRole('admin'), vendorController.getAllVendors);
router.post('/', checkAuth, requireRole('admin'), vendorController.createVendor);
router.get('/:id', checkAuth, requireRole('admin' , 'vendor'), vendorController.getVendorById);
router.put('/:id', checkAuth, requireRole('admin' , 'vendor'), vendorController.updateVendor);
router.delete('/:id', checkAuth, requireRole('admin', 'vendor'), vendorController.deleteVendor);

module.exports = router;