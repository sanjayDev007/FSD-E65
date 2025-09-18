const jwt = require('jsonwebtoken');

module.exports = function adminAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization || '';
        const token =
            (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null) ||
            req.headers['x-access-token'] ||
            (req.cookies && req.cookies.token) ||
            null;

        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }

            const secret = process.env.JWT_ADMIN_SECRET;
            if (!secret) {
                console.error('JWT_SECRET not set in environment');
                return res.status(500).json({ message: 'Server configuration error' });
            }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }
            req.user = decoded;
            req.role = "admin";
            next();
        });
    } catch (e) {
        console.error('adminAuth error', e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};