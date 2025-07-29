import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

const socketHandler = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `User ${socket.user.fullName || socket.user.username} connected`
    );

    // Join a room
    socket.on("joinRoom", async (roomName) => {
      try {
        socket.join(roomName);

        // Update user activity in room
        await Room.findOneAndUpdate(
          { name: roomName },
          {
            $set: {
              "activeUsers.$[elem].lastSeen": new Date(),
            },
          },
          {
            arrayFilters: [{ "elem.user": socket.user._id }],
          }
        );

        // Get active users
        const room = await Room.findOne({ name: roomName }).populate(
          "activeUsers.user",
          "username avatar reputation"
        );

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const activeUsers =
          room?.activeUsers.filter((user) => user.lastSeen > tenMinutesAgo) ||
          [];

        // Notify room about new user
        socket.to(roomName).emit("user-joined", {
          user: socket.user,
          activeUsers: activeUsers.length,
        });

        socket.emit("joined-room", {
          room: roomName,
          activeUsers,
        });
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    // Leave a room
    socket.on("leaveRoom", async (roomName) => {
      try {
        socket.leave(roomName);

        // Update user activity
        await Room.findOneAndUpdate(
          { name: roomName },
          {
            $pull: {
              activeUsers: { user: socket.user._id },
            },
          }
        );

        // Notify room about user leaving
        socket.to(roomName).emit("user-left", {
          user: socket.user,
        });
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      try {
        const { message, room, isCode, language, replyTo } = data;

        // Validate room
        const roomExists = await Room.findOne({ name: room });
        if (!roomExists) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Create and save message
        const newMessage = new Chat({
          message,
          sender: socket.user._id,
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
            arrayFilters: [{ "elem.user": socket.user._id }],
          }
        );

        // Broadcast message to room
        io.to(room).emit("new-message", newMessage);
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      socket.to(data.room).emit("user-typing", {
        user: socket.user.username,
        isTyping: data.isTyping,
      });
    });

    // Message reactions
    socket.on("addReaction", async (data) => {
      try {
        const { messageId, emoji } = data;

        const chatMessage = await Chat.findById(messageId);

        if (!chatMessage) {
          socket.emit("error", { message: "Message not found" });
          return;
        }

        // Check if user already reacted with this emoji
        const existingReaction = chatMessage.reactions.find(
          (reaction) =>
            reaction.user.toString() === socket.user._id.toString() &&
            reaction.emoji === emoji
        );

        if (existingReaction) {
          // Remove reaction
          chatMessage.reactions = chatMessage.reactions.filter(
            (reaction) =>
              !(
                reaction.user.toString() === socket.user._id.toString() &&
                reaction.emoji === emoji
              )
          );
        } else {
          // Add reaction
          chatMessage.reactions.push({
            user: socket.user._id,
            emoji,
          });
        }

        await chatMessage.save();
        await chatMessage.populate("reactions.user", "username");

        // Broadcast reaction update
        io.to(chatMessage.room).emit("reaction-updated", {
          messageId,
          reactions: chatMessage.reactions,
        });
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    // Update activity periodically
    const activityInterval = setInterval(async () => {
      try {
        const rooms = Array.from(socket.rooms);
        for (const room of rooms) {
          if (room !== socket.id) {
            await Room.findOneAndUpdate(
              { name: room },
              {
                $set: {
                  "activeUsers.$[elem].lastSeen": new Date(),
                },
              },
              {
                arrayFilters: [{ "elem.user": socket.user._id }],
              }
            );
          }
        }
      } catch (error) {
        console.error("Error updating activity:", error);
      }
    }, 30000); // Update every 30 seconds

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log(`User ${socket.user.username} disconnected`);

      clearInterval(activityInterval);

      try {
        // Remove user from all active rooms
        await Room.updateMany(
          { "activeUsers.user": socket.user._id },
          {
            $pull: {
              activeUsers: { user: socket.user._id },
            },
          }
        );

        // Notify all rooms about user leaving
        const rooms = Array.from(socket.rooms);
        for (const room of rooms) {
          if (room !== socket.id) {
            socket.to(room).emit("user-left", {
              user: socket.user,
            });
          }
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });
};

export default socketHandler;
