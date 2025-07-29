import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String, // You can use ObjectId and reference User in the future
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  votes: {
    type: Number,
    default: 0,
  },
  // Optionally: votes, comments
});

export default mongoose.model("Answer", answerSchema);
