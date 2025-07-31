import express from 'express';
import { authenticate as verifyToken } from '../middleware/authMiddleWare.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

router.get('/profile/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

export default router;
