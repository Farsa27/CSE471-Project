const Feedback = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
  const { rating, comment } = req.body;
  if (typeof rating === "undefined") {
    return res.status(400).json({ message: "Rating is required" });
  }

  try {
    const feedback = new Feedback({
      user: req.user ? req.user.id : undefined,
      rating,
      comment,
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
