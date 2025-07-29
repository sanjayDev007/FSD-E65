const User = require('../model/User');

const getUsers =  (req, res) => {
    let userId = parseInt(req.params.id, 10);
    let user = User.findById(userId); // Not Needed Now
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const createUser = (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    
    newUser.save()
        .then(user => res.status(201).json(user)) // Not Needed Now
        .catch(err => res.status(400).json({ message: 'Error creating user', error: err }));
}

module.exports = {
    getUsers,
    createUser
};