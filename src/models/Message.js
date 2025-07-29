import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true }, // roomName as string
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;

