import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../data/users.js';
import JWT_SECRET from '../utils/jwtSecret.js';
import { addToken, invalidateToken } from '../utils/tokens.js';

//Login user and generate JWT token
export const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        //Validate that username and password are provided
        if (!username || !password) {
            return res.status(400).json({message: 'Username and password are required.'});
        }
        //Find user by username
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(404).json({message: 'User not found.'});
        }
        //Validate password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid username or password.'});
        }
        //Generate JWT token
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            roles: user.roles
        }, JWT_SECRET, {expiresIn: '1h'});
        addToken(user.id, token);

        return res.status(200).json({
            message: 'Logged in successfully',
            token,
            id: user.id,
            username: user.username,
            roles: user.roles
        });
    } catch (error) {
        res.status(401).json({message: 'Invalid username or password.'});
    }
}

export const logoutUser = (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'No token provided.' });
        }

        invalidateToken(token);
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed.' });
    }
};