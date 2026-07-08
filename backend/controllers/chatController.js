import ChatModel from "../models/ChatModel.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      userName: req.user.name,
      name: "New Chat",
      messages: [],
    };

    await ChatModel.create(chatData);
    return res.json({ success: true, message: "Chat Cretaed" });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await ChatModel.find({ userId }).sort({ updatedAt: -1 });
    return res.json({ success: true, chats });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await ChatModel.deleteOne({ _id: chatId, userId });
    return res.json({ success: true, message: "Chat Deleted" });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};
