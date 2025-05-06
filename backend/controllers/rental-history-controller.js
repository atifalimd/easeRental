import Rental from "../models/rental-history-model.js";
import User from "../models/user-model.js";
import getListings from "../models/listing-model.js";

const getRentalHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Get all rentals where the user is either tenant or landlord
    const rentals = await Rental.find({
      $or: [{ tenantId: userId }, { landlordId: userId }],
    });

    // Step 2: Manually fetch related data
    const allRentals = await Promise.all(
      rentals.map(async (rental) => {
        const tenant = await User.findById(rental.tenantId).select(
          "username email"
        );
        const landlord = await User.findById(rental.landlordId).select(
          "username email"
        );
        const property = await getListings
          .findById(rental.propertyId)
          .select("name address");

        return {
          ...rental.toObject(),
          tenant,
          landlord,
          property,
        };
      })
    );

    res.status(200).json({ success: true, rentals: allRentals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default getRentalHistory;
