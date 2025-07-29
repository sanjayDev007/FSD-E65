const router = require('express').Router();
const cartController = require('../controller/cartController');
router.post('/', cartController.addCartItem); 

router.get('/' , cartController.getCartItems  )
router.put('/:id', cartController.updateCartItem )


router.delete('/:id',cartController.deleteCartItem )


module.exports = router;