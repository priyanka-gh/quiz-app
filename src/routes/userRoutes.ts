import express from 'express';
import { register, login, getProfile, deleteProfile } from '../controllers/UserController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.delete('/profile', authMiddleware, deleteProfile);

export default router;
