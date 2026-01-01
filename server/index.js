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
const notificationRoutes = require('./routes/notifications');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/notifications', notificationRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
