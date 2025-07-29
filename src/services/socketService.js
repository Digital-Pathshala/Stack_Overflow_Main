import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

class SocketService {
  socket;

  connect(token) {
    this.socket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });
  }

  joinRoom(room) {
    if (this.socket) this.socket.emit("joinRoom", room);
  }

  sendMessage(message) {
    if (this.socket) this.socket.emit("sendMessage", message);
  }

  setTyping(room, isTyping) {
    if (this.socket) this.socket.emit("typing", { room, isTyping });
  }

  on(event, callback) {
    if (this.socket) this.socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) this.socket.off(event, callback);
  }

  leaveRoom(room) {
    if (this.socket) this.socket.emit("leaveRoom", room);
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }
}

export default new SocketService();
