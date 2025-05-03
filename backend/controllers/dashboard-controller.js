import ActiveSchema from "../models/active-model.js";
import PendingSchema from "../models/pending-model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import EarningSchema from "../models/earning-model.js";
import userSchema from "../models/user-model.js";
import Listing from "../models/listing-model.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get active listings for logged-in landlord
export const getActiveListings = async (req, res, next) => {
  try {
    const active = await Listing.find({
      userRef: req.user.id,
      status: "active",
    });

    res.status(200).json({
      success: true,
      count: active.length,
      active,
    });
  } catch (error) {
    next(error);
  }
};

// Get pending requests for landlord
export const getPendingListings = async (req, res, next) => {
  try {
    const pending = await Listing.find({
      userRef: req.user.id,
      status: "pending",
    });
    res.status(200).json({
      success: true,
      count: pending.length,
      pending,
    });
    console.log("User Info:", req.user);
  } catch (error) {
    next(error);
  }
};

export const createActiveListing = async (req, res, next) => {
  try {
    const newListing = new ActiveSchema({
      ...req.body,
      userRef: req.user.id,
      status: "active",
    });

    await newListing.save();

    const earning = new EarningSchema({
      landlordId: req.user.id,
      listingId: newListing._id,
      amount: req.body.amount || 0,
    });

    await earning.save();

    res.status(201).json({
      success: true,
      listing: newListing,
    });
  } catch (error) {
    next(error);
  }
};

// controllers/dashboard-controller.js

export const createPendingListing = async (req, res, next) => {
  try {
    const { listingId, landlordId, message } = req.body;

    if (!isValidObjectId(listingId) || !isValidObjectId(landlordId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listingId or landlordId format",
      });
    }

    const newPending = new PendingSchema({
      listingId: new mongoose.Types.ObjectId(listingId),
      landlordId: new mongoose.Types.ObjectId(landlordId),
      message,
      tenantId: new mongoose.Types.ObjectId(req.user.id),
      status: "pending",
    });

    await newPending.save();

    res.status(201).json({
      success: true,
      message: "Pending request created",
      data: newPending,
    });
  } catch (error) {
    next(error);
  }
};

export const getEarnings = async (req, res, next) => {
  {
    try {
      const earning = await Listing.find({
        userRef: req.user.id,
        status: "active",
      });
      const totalEarnings = earning.reduce(
        (sum, item) => sum + item.regularPrice,
        0
      );

      res.status(200).json({
        success: true,
        count: earning.length,
        totalEarnings,
      });
    } catch (error) {
      next(error);
    }
  }
  // try {
  //   const earnings = await Listing.find({
  //     landlordId: req.user.id, // This ID must match what's in DB
  //
  //   });

  //   const totalEarnings = earnings.reduce(
  //     (sum, earning) => sum + earning.amount,
  //     0
  //   );

  //   res.status(200).json({
  //     success: true,
  //     totalEarnings,
  //     earnings,
  //   });
  // } catch (error) {
  //   next(error);
  // }
};

export const getAccountDetails = async (req, res, next) => {
  try {
    const user = await userSchema
      .findById(req.user.id)
      .select("username email");

    const earnings = await EarningSchema.find({
      landlordId: req.user.id,
    }).select("amount listingId paid createdAt");

    const total = earnings.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      success: true,
      user,
      earnings: {
        totalEarnings: total,
        list: earnings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const landlordDetails = async (req, res, next) => {
  try {
    // Get the landlord ID from the JWT token
    const landlordId = req.user.id;

    // Fetch landlord's listings, tenants, and earnings (example logic)
    const listings = await ActiveSchema.find({ userRef: landlordId });
    const earnings = await EarningSchema.find({ landlordId });
    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        listings,
        totalEarnings,
        earnings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const tenantDetails = async (req, res, next) => {
  try {
    const tenantId = req.user.id;

    // 1. Get tenant's info
    const tenant = await User.findById(tenantId).select("username email role");

    // 2. Get active listings they are currently renting
    const activeRentals = await ActiveSchema.find({ tenantId });

    // 3. Get pending rental requests
    const pendingRequests = await PendingSchema.find({
      tenantId,
      status: "pending",
    });

    // 4. Get rental history (if you have a separate model for completed rentals)
    // const rentalHistory = await RentalHistory.find({ tenantId });

    res.status(200).json({
      success: true,
      tenant,
      activeRentals,
      pendingRequests,
      // rentalHistory
    });
  } catch (error) {
    next(error);
  }
};
