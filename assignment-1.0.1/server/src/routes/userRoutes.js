import express from 'express';
import {getUserById, register, getWonAuctions } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

//Admin-only routes
router.get('/:id', verifyToken, verifyRole('admin'), getUserById); //GET user by ID

//Public route for registration
router.post('/register', register); //POST Register

//User-only routes
router.get('/:id/won-auctions', verifyToken, getWonAuctions); //GET won auctions
export default router;