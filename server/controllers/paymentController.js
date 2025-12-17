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
    const { amount } = req.body; // amount in BDT (will convert to paisa)

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paisa (smallest currency unit)
      currency: 'bdt',
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

    // Check if user already has a booking for this route
    const existingBooking = await Booking.findOne({
      userEmail: passengerEmail,
      from: from,
      to: to
    });

    if (existingBooking) {
      return res.status(400).json({ 
        error: 'You have already booked a ticket for this route. Only one ticket per route is allowed.' 
      });
    }

    const booking = new Booking({
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
