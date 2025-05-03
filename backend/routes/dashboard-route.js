import express from "express";
import {
  getActiveListings,
  getPendingListings,
  createActiveListing,
  createPendingListing,
  getEarnings,
  getAccountDetails,
  landlordDetails,
  tenantDetails,
} from "../controllers/dashboard-controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { authorizeRoles } from "../utils/auth-role.js";

const router = express.Router();

router.post("/create-active-listing", verifyToken, createActiveListing);

router.post("/create-pending-listing", verifyToken, createPendingListing);

// Active listings endpoint
router.get("/get-active-listing", verifyToken, getActiveListings);

// Pending requests endpoint
router.get("/get-pending-requests", verifyToken, getPendingListings);

router.get("/get-earnings", verifyToken, getEarnings);

router.get("/get-account", verifyToken, getAccountDetails);

router.get(
  "/landlord-dashboard",
  verifyToken,
  authorizeRoles("landlord"),
  landlordDetails
);

router.get(
  "/tenant-dashboard",
  verifyToken,
  authorizeRoles("tenant"),
  tenantDetails
);

export default router;
