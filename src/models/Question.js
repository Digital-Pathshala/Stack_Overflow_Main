import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false, // For backward compatibility, we'll keep description as required
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // For backward compatibility
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
      default: 0,
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
