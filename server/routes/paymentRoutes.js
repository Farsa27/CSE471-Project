const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Save booking after payment
router.post('/save-booking', paymentController.saveBookingAfterPayment);

module.exports = router;
