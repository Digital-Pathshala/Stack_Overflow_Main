import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const serverUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
    console.log("Connecting to Socket.IO server at:", serverUrl);

    this.socket = io(serverUrl, {
      path: "/socket.io",
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from Socket.IO server. Reason:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    this.socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log("Disconnecting from Socket.IO server...");
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Room operations
  joinRoom(roomName) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("join-room", roomName);
    }
  }

  leaveRoom(roomName) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("leave-room", roomName);
    }
  }

  // Message operations
  sendMessage(messageData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("send-message", messageData);
    }
  }

  // Typing indicator
  setTyping(roomName, isTyping) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("typing", { room: roomName, isTyping });
    }
  }

  // Reactions
  addReaction(messageId, emoji) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("add-reaction", { messageId, emoji });
    }
  }

  // Event listeners
  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, []);
      }
      this.listeners.get(eventName).push(callback);
    }
  }

  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
      if (this.listeners.has(eventName)) {
        const callbacks = this.listeners.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callbacks, eventName) => {
        callbacks.forEach((callback) => {
          this.socket.off(eventName, callback);
        });
      });
      this.listeners.clear();
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

const socketService = new SocketService();

export default socketService;
