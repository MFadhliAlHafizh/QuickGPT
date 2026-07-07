import axios from "axios";
import { toFile } from "@imagekit/nodejs";
import ChatModel from "../models/chatModel.js";
import UserModel from "../models/UserModel.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check Credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to user this feature",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await ChatModel.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-3.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };
    chat.messages.push(reply);
    await chat.save();
    await UserModel.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    return res.json({ success: true, reply });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Generate Image : /api/messages/image
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check credits
    if (req.user.credits < 2) {
      return res.status(400).json({
        success: false,
        message: "You don't have enough credits to use this feature.",
      });
    }

    const { chatId, prompt, isPublished } = req.body;
    const chat = await ChatModel.findOne({ _id: chatId, userId });

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Encode prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // AI Image Generation URL
    const generatedImageUrl =
      `${process.env.IMAGEKIT_URL_ENDPOINT}` +
      `/ik-genimg-prompt-${encodedPrompt}` +
      `/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    // Generate image
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // Convert Buffer to File (recommended by SDK)
    const file = await toFile(
      Buffer.from(aiImageResponse.data),
      `${Date.now()}.png`,
    );

    // Upload to ImageKit Media Library
    const uploadResponse = await imagekit.files.upload({
      file,
      fileName: `${Date.now()}.png`,
      folder: "/quickgpt",
      useUniqueFileName: true,
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);

    await chat.save();
    await UserModel.findByIdAndUpdate(userId, { $inc: { credits: -2 } });
    return res.status(200).json({ success: true, reply });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
