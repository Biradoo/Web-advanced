import express from 'express';
import { loginUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser); //POST user login
router.post('/logout', logoutUser); //POST user logout


export default router