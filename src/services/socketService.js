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

    this.socket = io(
      import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
      {
        auth: { token },
        autoConnect: true,
      }
    );

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Room operations
  joinRoom(roomName) {
    if (this.socket) {
      this.socket.emit("join-room", roomName);
    }
  }

  leaveRoom(roomName) {
    if (this.socket) {
      this.socket.emit("leave-room", roomName);
    }
  }

  // Message operations
  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit("send-message", messageData);
    }
  }

  // Typing indicator
  setTyping(roomName, isTyping) {
    if (this.socket) {
      this.socket.emit("typing", { room: roomName, isTyping });
    }
  }

  // Reactions
  addReaction(messageId, emoji) {
    if (this.socket) {
      this.socket.emit("add-reaction", { messageId, emoji });
    }
  }

  // Event listeners
  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);

      // Store listener for cleanup
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, []);
      }
      this.listeners.get(eventName).push(callback);
    }
  }

  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);

      // Remove from stored listeners
      if (this.listeners.has(eventName)) {
        const callbacks = this.listeners.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Cleanup all listeners
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

  // Check connection status
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
