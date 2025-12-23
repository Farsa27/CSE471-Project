const express = require('express');
const router = express.Router();

// Sample in-memory storage (replace with MongoDB later)
let notifications = [
  // Example adverse situation
  {
    _id: "1",
    title: "Train Delay Alert",
    message: "Train 123A is delayed by 45 minutes due to signal failure.",
    alternative: "Take Train 124B (next departure +20 mins) or Bus Route 56 from Station X",
    timestamp: new Date().toISOString(),
    affectedUsers: [] // Or target all users for testing
  }
];

// GET all notifications
router.get('/', (req, res) => {
  res.json({ notifications });
});

// POST to create new adverse notification (call from admin panel later)
router.post('/', (req, res) => {
  const newNotif = {
    _id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  notifications.push(newNotif);
  res.status(201).json(newNotif);
});

module.exports = router;