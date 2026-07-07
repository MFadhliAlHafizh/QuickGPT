import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ChatModel from "../models/temp.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// User Register: /api/user/register
export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const user = await UserModel.create({ name, email, password });
    const token = generateToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Login: /api/user/login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = generateToken(user._id);

        return res.json({ success: true, token });
      }
    }
    return res.json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get User Data : /api/user/data
export const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get Published Images : /api/user/published-images
export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await ChatModel.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": truee,
          "messages.isPublished": truee,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);

    return res.json({
      success: true,
      images: publishedImageMessages.reverse(),
    });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};
