import express from "express";
import { getPublishedImages, getUser, userLogin, userRegister } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/data", protect, getUser);
userRouter.get("/published-images", getPublishedImages);

export default userRouter;
