import users from '../data/users.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUserById = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
};

export const register = (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and/or password are required' });
    }
    //Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists. Please log in.' });
    }
    //Hash password before storing
    const passwordHash = bcrypt.hashSync(password, 10);
    //Create new user
    const newUser = {
        id: users.length + 1,
        username,
        passwordHash,
        roles: ['bidder'], //Assign 'bidder' role by default, or set 'admin' manually if needed
        wonAuctions: []
    };

    users.push(newUser);
    //Generate JWT token for new user
    const token = jwt.sign({ id: newUser.id, username: newUser.username, roles: newUser.roles }, 'secretKey', { expiresIn: '1h' });
    //Send token back to client
    return res.json({ message: 'Registration successful', token, username: { id: newUser.id, username: newUser.username, roles: newUser.roles } });
};


export const getWonAuctions = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    //Return the won auctions and the total amount due
    const totalAmountDue = user.wonAuctions.reduce((total, auction) => total + auction.price, 0);
    res.json({ wonAuctions: user.wonAuctions, totalAmountDue });
};