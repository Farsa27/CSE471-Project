
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String, // or Date if you prefer actual date format
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
