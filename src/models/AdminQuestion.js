import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  votes: {
    type: Number,
    default: 0
  },
  answers: [AnswerSchema]
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;