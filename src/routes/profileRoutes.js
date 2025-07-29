import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

router.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

export default router;
