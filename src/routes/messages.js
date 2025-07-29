import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Fetch messages for a specific room
router.get("/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .populate("sender", "userName") // Optional: populate user info
      .sort({ sentAt: 1 }); // oldest to newest
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
