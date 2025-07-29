import Room from "../models/Room.js";
import User from "../models/User.js";

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate("createdBy", "username")
      .populate("activeUsers.user", "username avatar")
      .sort({ messageCount: -1 })
      .exec();

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoomDetails = async (req, res) => {
  try {
    const { roomName } = req.params;

    const room = await Room.findOne({ name: roomName })
      .populate("createdBy", "username avatar reputation")
      .populate("members.user", "username avatar reputation")
      .populate("activeUsers.user", "username avatar")
      .exec();

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    // Only allow admins to create rooms
    if (!req.user.role || req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can create rooms" });
    }

    const { name, content, tags, isPrivate } = req.body;
    const userId = req.user.id;

    // Check if room already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ error: "Room already exists" });
    }

    const newRoom = new Room({
      name,
      description,
      tags: tags || [],
      isPrivate: isPrivate || false,
      createdBy: userId,
      members: [
        {
          user: userId,
          role: "admin",
        },
      ],
      activeUsers: [
        {
          user: userId,
          lastSeen: new Date(),
        },
      ],
    });

    await newRoom.save();
    await newRoom.populate("createdBy", "username avatar reputation");
    await newRoom.populate("members.user", "username avatar reputation");

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomName } = req.params;
    const userId = req.user.id;

    const room = await Room.findOne({ name: roomName });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if user is already a member
    const isMember = room.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      room.members.push({
        user: userId,
        role: "member",
      });
    }

    // Update active users
    const activeUserIndex = room.activeUsers.findIndex(
      (user) => user.user.toString() === userId
    );

    if (activeUserIndex > -1) {
      room.activeUsers[activeUserIndex].lastSeen = new Date();
    } else {
      room.activeUsers.push({
        user: userId,
        lastSeen: new Date(),
      });
    }

    await room.save();
    await room.populate("activeUsers.user", "username avatar");

    res.json({ message: "Successfully joined room", room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomName } = req.params;
    const userId = req.user.id;

    const room = await Room.findOne({ name: roomName });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Remove from active users
    room.activeUsers = room.activeUsers.filter(
      (user) => user.user.toString() !== userId
    );

    // Don't remove from members, just mark as inactive
    await room.save();

    res.json({ message: "Successfully left room" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActiveUsers = async (req, res) => {
  try {
    const { roomName } = req.params;

    const room = await Room.findOne({ name: roomName })
      .populate("activeUsers.user", "username avatar reputation")
      .exec();

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Filter users active in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const activeUsers = room.activeUsers.filter(
      (user) => user.lastSeen > tenMinutesAgo
    );

    res.json({ activeUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserActivity = async (req, res) => {
  try {
    const { roomName } = req.params;
    const userId = req.user.id;

    await Room.findOneAndUpdate(
      { name: roomName },
      {
        $set: {
          "activeUsers.$[elem].lastSeen": new Date(),
        },
      },
      {
        arrayFilters: [{ "elem.user": userId }],
      }
    );

    res.json({ message: "Activity updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllRooms,
  getRoomDetails,
  createRoom,
  joinRoom,
  leaveRoom,
  getActiveUsers,
  updateUserActivity,
};
