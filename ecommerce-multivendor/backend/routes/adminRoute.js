const router = require('express').Router();
const adminAuth = require('../middlewares/adminAuth');

const vendorController = require('../controllers/vendorController');

router.post('/vendors', adminAuth, vendorController.createVendor);
router.get('/vendors', adminAuth, vendorController.getAllVendors);
router.get('/vendors/:id', adminAuth, vendorController.getVendorById);
router.put('/vendors/:id', adminAuth, vendorController.updateVendor);
router.delete('/vendors/:id', adminAuth, vendorController.deleteVendor);

module.exports = router;