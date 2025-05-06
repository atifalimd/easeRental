const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  address: String,
  images: [String], // array of image URLs
  amenities: [String],
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
