import express from "express";
import {
  updatePreferences,
  getPreferences,
} from "../controllers/tenant-pref-controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/preferences", verifyToken, getPreferences);
router.post("/preferences", verifyToken, updatePreferences);

export default router;
