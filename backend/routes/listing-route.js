import express from "express";
import {
  createListing,
  uploadImages,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing-controller.js";

import {
  getActiveListings,
  getPendingListings,
} from "../controllers/dashboard-controller.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/upload-images", uploadImages);

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
