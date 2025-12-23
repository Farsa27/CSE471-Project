const User = require("../models/User");
const Stripe = require("stripe");

// Initialize Stripe
let stripe;
const getStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// Generate unique WiFi credentials
const generateWifiCredentials = (userId) => {
  const wifiId = `WIFI_${userId.substring(0, 8).toUpperCase()}`;
  const wifiPassword = `${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  return { wifiId, wifiPassword };
};

// Get WiFi subscription status
exports.getWifiStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "wifiSubscriptionActive wifiSubscriptionExpiry wifiId wifiPassword"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if subscription has expired
    if (user.wifiSubscriptionActive && user.wifiSubscriptionExpiry) {
      if (new Date() > new Date(user.wifiSubscriptionExpiry)) {
        // Subscription expired, update status
        user.wifiSubscriptionActive = false;
        await user.save();
        
        return res.json({
          isActive: false,
          expiryDate: null,
          wifiId: "",
          wifiPassword: "",
        });
      }
    }

    res.json({
      isActive: user.wifiSubscriptionActive,
      expiryDate: user.wifiSubscriptionExpiry,
      wifiId: user.wifiId,
      wifiPassword: user.wifiPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create payment intent for WiFi subscription
exports.createWifiPaymentIntent = async (req, res) => {
  try {
    const amount = 100; // 100 Taka monthly subscription

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
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

// Activate WiFi subscription after payment
exports.activateWifiSubscription = async (req, res) => {
  try {
    const { userId, paymentIntentId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate WiFi credentials if not already generated
    let wifiId = user.wifiId;
    let wifiPassword = user.wifiPassword;

    if (!wifiId || !wifiPassword) {
      const credentials = generateWifiCredentials(userId);
      wifiId = credentials.wifiId;
      wifiPassword = credentials.wifiPassword;
    }

    // Set subscription active with 2 minutes validity
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 2); // 2 minutes validity

    user.wifiSubscriptionActive = true;
    user.wifiSubscriptionExpiry = expiryDate;
    user.wifiId = wifiId;
    user.wifiPassword = wifiPassword;

    await user.save();

    res.status(200).json({
      message: "WiFi subscription activated successfully",
      wifiId,
      wifiPassword,
      expiryDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
