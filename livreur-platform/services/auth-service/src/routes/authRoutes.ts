import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

export const authRouter = express.Router();

// Route inscription
authRouter.post('/register', registerUser);

// Route connexion
authRouter.post('/login', loginUser);

// Route protégée
authRouter.get('/profile', authenticateToken, getProfile);
