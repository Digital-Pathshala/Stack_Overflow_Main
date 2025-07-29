import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: String,
    default: 'general',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isCode: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: null
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    default: null
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatSchema.index({ room: 1, timestamp: -1 });
chatSchema.index({ sender: 1 });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;