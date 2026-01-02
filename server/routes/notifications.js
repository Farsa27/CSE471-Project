
const express = require('express');
const router = express.Router();
const User = require('../models/User'); 


router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const sortedNotifications = user.notifications
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(sortedNotifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Server error while fetching notifications' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { email, title, message, alternative } = req.body;

    if (!email || !title || !message) {
      return res.status(400).json({ error: 'Email, title, and message are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newNotification = {
      title,
      message,
      alternative: alternative || "",
      timestamp: new Date(),
      read: false
    };

    user.notifications.push(newNotification);
    await user.save();

    res.status(201).json({
      message: 'Notification added successfully',
      notification: newNotification
    });
  } catch (err) {
    console.error('Error adding notification:', err);
    res.status(500).json({ error: 'Server error while adding notification' });
  }
});

router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, alternative } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const newNotification = {
      title,
      message,
      alternative: alternative || "",
      timestamp: new Date(),
      read: false
    };

  
    await User.updateMany(
      {},
      { $push: { notifications: newNotification } }
    );

    res.status(201).json({
      message: 'Notification broadcasted to all users',
      notification: newNotification
    });
  } catch (err) {
    console.error('Error broadcasting notification:', err);
    res.status(500).json({ error: 'Server error during broadcast' });
  }
});

module.exports = router;