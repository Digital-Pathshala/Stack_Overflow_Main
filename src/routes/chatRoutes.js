import express from 'express';
import Chat from '../models/Chat.js';
import Room from '../models/Room.js';
import { authenticate as authMiddleware } from '../middleware/authMiddleWare.js';

const router = express.Router();

// Get messages for a room
router.get('/messages/:roomName', authMiddleware, async (req, res) => {
  try {
    const { roomName } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Chat.find({ room: roomName })
      .populate('sender', 'fullName username avatar')
      .populate('replyTo', 'message sender')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        room: roomName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all rooms
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate('createdBy', 'fullName username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        rooms
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create a new room (admin only)
router.post('/rooms', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create rooms'
      });
    }

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room already exists'
      });
    }

    const newRoom = new Room({
      name,
      description,
      createdBy: req.user._id
    });

    await newRoom.save();

    res.status(201).json({
      success: true,
      data: newRoom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get room details
router.get('/rooms/:roomName', authMiddleware, async (req, res) => {
  try {
    const { roomName } = req.params;

    const room = await Room.findOne({ name: roomName })
      .populate('createdBy', 'fullName username')
      .populate('activeUsers.user', 'fullName username avatar');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;