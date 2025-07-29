import mongoose from "mongoose"

const userProfileSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  profileImage: {
    type: String
  },
  github: {
    type: String
  },
  linkedin: {
    type: String
  },
  website: {
    type: String
  },
  skills: {
    type: [String],
    default: []
  },
  reputation: {
    type: Number,
    default: 0
  },
  questionsAsked: {
    type: Number,
    default: 0
  },
  answersGiven: {
    type: Number,
    default: 0
  },
  upvotesReceived: {
    type: Number,
    default: 0
  },
  downvotesReceived: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }},{
    timestamps: true

});

const userProfile = mongoose.model("userProfile", userProfileSchema)

export default userProfile;