const Stripe = require('stripe');
const Booking = require('../models/Booking');

// Initialize Stripe lazily to ensure dotenv is loaded
let stripe;
const getStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // amount in BDT (will convert to cents)

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents (smallest currency unit)
      currency: 'usd', // Using USD as BDT is not supported in test mode
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to generate unique ticket ID
const generateTicketId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TKT-${timestamp}-${randomStr}`;
};

// Save booking after successful payment
exports.saveBookingAfterPayment = async (req, res) => {
  try {
    const {
      trainId,
      trainName,
      from,
      to,
      departure,
      arrival,
      price,
      passengerName,
      passengerEmail,
      paymentIntentId
    } = req.body;

    // Check if user already has a booking for this exact route and time
    console.log('Checking for existing booking:', {
      userEmail: passengerEmail,
      from,
      to,
      departureTime: departure,
      arrivalTime: arrival
    });
    
    const existingBooking = await Booking.findOne({
      userEmail: passengerEmail,
      from: from,
      to: to,
      departureTime: departure,
      arrivalTime: arrival
    });

    console.log('Existing booking found:', existingBooking);

    if (existingBooking) {
      return res.status(400).json({ 
        error: 'You have already booked a ticket for this route at this time. Please choose a different train or time.' 
      });
    }

    // Generate unique ticket ID
    const ticketId = generateTicketId();
    
    // Calculate expiry date (7 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const booking = new Booking({
      ticketId,
      trainId,
      trainName,
      from,
      to,
      departureTime: departure,
      arrivalTime: arrival,
      price,
      userName: passengerName,
      userEmail: passengerEmail,
      paymentIntentId,
      expiryDate,
      status: 'confirmed'
    });

    await booking.save();
    res.status(201).json({ 
      message: 'Booking saved successfully!',
      booking 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
