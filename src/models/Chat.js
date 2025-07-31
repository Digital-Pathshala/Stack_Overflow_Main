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
    required: true,
    default: 'general'
  },
  isCode: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: null
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    default: null
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
chatSchema.index({ room: 1, createdAt: -1 });
chatSchema.index({ sender: 1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;