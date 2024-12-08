// authMiddleware.js
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../utils/jwtSecret.js';
import {validateToken} from '../utils/tokens.js';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    if (!validateToken(token)) {
        return res.status(401).json({ message: 'Token is invalid or expired.' });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};