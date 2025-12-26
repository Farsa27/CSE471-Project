const express = require("express");
const router = express.Router();
const wifiController = require("../controllers/wifiController");

// Get WiFi subscription status
router.get("/status/:userId", wifiController.getWifiStatus);

// Create payment intent for WiFi subscription
router.post("/create-payment-intent", wifiController.createWifiPaymentIntent);

// Activate WiFi subscription after payment
router.post("/activate", wifiController.activateWifiSubscription);

module.exports = router;
