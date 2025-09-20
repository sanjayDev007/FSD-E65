const jwt = require('jsonwebtoken');

function getTokenFromRequest(req) {
    // Authorization: Bearer <token>
    if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
    }
    // x-access-token header
    if (req.headers && req.headers['x-access-token']) return req.headers['x-access-token'];
    // cookie named token
    if (req.cookies && req.cookies.token) return req.cookies.token;
    // query string ?token=
    if (req.query && req.query.token) return req.query.token;
    return null;
}

/**
 * Express middleware to verify JWT and attach payload to req.user
 * Usage: app.use(checkAuth) or app.get('/private', checkAuth, handler)
 */
function checkAuth(req, res, next) {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ error: 'Authentication token missing' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'JWT secret not configured' });

    try {
        const payload = jwt.verify(token, secret);
        // attach payload (user id, roles, etc.) to request
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

/**
 * Optional helper to require a role:
 * app.get('/admin', checkAuth, requireRole('admin'), handler)
 */
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Authentication required' });
        if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
        req.role = role;
        return next();
    };
}

module.exports = { checkAuth, requireRole };