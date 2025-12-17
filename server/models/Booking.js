
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  trainName: String,
  from: String,
  to: String,
  departureTime: String,
  arrivalTime: String,
  price: Number,
  userName: {
    type: String,
    default: "Guest User",
  },
  userEmail: {
    type: String,
    default: "",
  },
  paymentIntentId: {
    type: String,
    default: "",
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "confirmed"],
    default: "Pending",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
