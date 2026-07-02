import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({
        status: false,
        message: "Not authorized, user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(402).json({ message: "Not authorized, token failed" });
  }
};
