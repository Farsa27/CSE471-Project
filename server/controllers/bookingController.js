
const Booking = require("../models/Booking");


const createBooking = async (req, res) => {
  try {
    const { trainName, from, to, passengerName, passengerPhone } = req.body;

    if (!trainName || !from || !to || !passengerName || !passengerPhone) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["trainName", "from", "to", "passengerName", "passengerPhone"],
      });
    }

    const booking = await Booking.create(req.body);
    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    res.status(500).json({ error: "Booking failed", details: err.message });
  }
};


const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingTime: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings", details: err.message });
  }
};


const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booking", details: err.message });
  }
};


const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ success: true, message: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking", details: err.message });
  }
};


const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
};

// Get bookings by user email
const getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await Booking.find({ userEmail: email }).sort({ bookingTime: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user bookings", details: err.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getUserBookings,
};
