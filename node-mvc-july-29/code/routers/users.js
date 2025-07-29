const router = require('express').Router();
const userController = require('../controller/userController');
const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Alice Smith' },
    { id: 4, name: 'Bob Johnson' }
];
// Sample user data
router.get('/', (req, res) => {
    res.json(users);
});

// Get user by ID
router.get('/:id', userController.getUsers);

router.post('/', userController.createUser);

module.exports = router;
