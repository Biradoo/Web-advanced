import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided.'});
    }

    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
export default verifyToken;