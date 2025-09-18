const router = require('express').Router();
const vendorAuth = require('../middlewares/vendorAuth');

const vendorController = require('../controllers/vendorController');

router.get('/', vendorAuth, vendorController.getVendorById);
router.put('/', vendorAuth, vendorController.updateVendor);
router.delete('/', vendorAuth, vendorController.deleteVendor);

module.exports = router;