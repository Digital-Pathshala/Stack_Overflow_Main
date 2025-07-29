import Chat from "../models/Chat.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

export const getChatMessages = async (req, res) => {
  try {
    const { roomName } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (page - 1) * limit;

    const messages = await Chat.find({ room: roomName })
      .populate("sender", "username avatar reputation")
      .populate("replyTo", "message sender")
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip(skip)
      .exec();

    res.json({
      messages: messages.reverse(),
      currentPage: page,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, room, isCode, language, replyTo } = req.body;
    const userId = req.user.id;

    // Validate room exists
    const roomExists = await Room.findOne({ name: room });
    if (!roomExists) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Create new message
    const newMessage = new Chat({
      message,
      sender: userId,
      room,
      isCode: isCode || false,
      language: language || null,
      replyTo: replyTo || null,
    });

    await newMessage.save();

    // Populate sender info
    await newMessage.populate("sender", "username avatar reputation");
    if (replyTo) {
      await newMessage.populate("replyTo", "message sender");
    }

    // Update room message count
    await Room.findOneAndUpdate(
      { name: room },
      {
        $inc: { messageCount: 1 },
        $set: {
          "activeUsers.$[elem].lastSeen": new Date(),
        },
      },
      {
        arrayFilters: [{ "elem.user": userId }],
      }
    );

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    const chatMessage = await Chat.findById(messageId);

    if (!chatMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (chatMessage.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this message" });
    }

    chatMessage.message = message;
    chatMessage.edited = true;
    chatMessage.editedAt = new Date();

    await chatMessage.save();
    await chatMessage.populate("sender", "username avatar reputation");

    res.json(chatMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const chatMessage = await Chat.findById(messageId);

    if (!chatMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (chatMessage.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this message" });
    }

    await Chat.findByIdAndDelete(messageId);

    // Update room message count
    await Room.findOneAndUpdate(
      { name: chatMessage.room },
      { $inc: { messageCount: -1 } }
    );

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    const chatMessage = await Chat.findById(messageId);

    if (!chatMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user already reacted with this emoji
    const existingReaction = chatMessage.reactions.find(
      (reaction) =>
        reaction.user.toString() === userId && reaction.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      chatMessage.reactions = chatMessage.reactions.filter(
        (reaction) =>
          !(reaction.user.toString() === userId && reaction.emoji === emoji)
      );
    } else {
      // Add reaction
      chatMessage.reactions.push({
        user: userId,
        emoji,
      });
    }

    await chatMessage.save();
    await chatMessage.populate("reactions.user", "username");

    res.json(chatMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchMessages = async (req, res) => {
  try {
    const { query, room } = req.query;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const searchCriteria = {
      message: { $regex: query, $options: "i" },
    };

    if (room) {
      searchCriteria.room = room;
    }

    const messages = await Chat.find(searchCriteria)
      .populate("sender", "username avatar reputation")
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip(skip)
      .exec();

    res.json({
      messages,
      currentPage: page,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getChatMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  searchMessages,
};
