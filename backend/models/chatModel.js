import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    userName: { type: String, required: true },
    name: { type: String, required: true },
    messages: [
      {
        isImage: { type: String, required: true },
        isPublished: { type: String, default: false },
        role: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const ChatModel = mongoose.model("Chat", chatSchema);
export default ChatModel;
