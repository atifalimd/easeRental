import express from "express";
const router = express.Router();
import getRentalHistory from "../controllers/rental-history-controller.js";
import { verifyToken } from "../utils/verifyUser.js";

router.get("/", verifyToken, getRentalHistory);

export default router;
