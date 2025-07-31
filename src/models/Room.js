import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  activeUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  messageCount: {
    type: Number,
    default: 0
  },
  maxUsers: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

// Index for efficient querying
roomSchema.index({ name: 1 });
roomSchema.index({ createdBy: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;