import express from "express";
import { getPlans } from "../controllers/creditController.js";

const creditRouter = express.Router();

creditRouter.get("/plan", getPlans);

export default creditRouter;
