const jsonwebtoken = require('jsonwebtoken');

const Admin = require('../models/Admin');
const Product = require('../models/Products');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_admin_secret_key';

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const admin = await Admin.findOne({ username: username });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jsonwebtoken.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '365d' });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}