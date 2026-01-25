const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/admin");
const staffRoutes = require("./routes/staff");
const lostItemRoutes = require("./routes/lostItemRoutes");
const notificationRoutes = require("./routes/notifications");
const feedbackRoutes = require("./routes/feedbackRoutes");
const studentVerificationRoutes = require("./routes/studentVerification");
const wifiRoutes = require("./routes/wifiRoutes");
const adRoutes = require("./routes/adRoutes");


dotenv.config();

const app = express();

// Configure CORS for client deployment
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  process.env.CLIENT_URL || 'https://mass-transit-client.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without origin (like mobile apps or Postman)
    // Also allow all localhost variants for development
    if (!origin || allowedOrigins.includes(origin) || origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Mass Transit Control System API', status: 'running' });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/student-verification', studentVerificationRoutes);
app.use('/api/wifi', wifiRoutes);
app.use('/api/ads', adRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
