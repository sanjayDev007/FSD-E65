const router = require('express').Router();
const userController = require('../controllers/userContoller');
const userAuth = require('../middleware/userAuth');

router.get('/', userController.getUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/protected', userAuth, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed', userId: req.userId });
});

module.exports = router;