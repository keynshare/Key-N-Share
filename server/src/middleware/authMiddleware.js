const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../constants');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. Invalid token format.' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        console.error('Token verification error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = authenticate;
