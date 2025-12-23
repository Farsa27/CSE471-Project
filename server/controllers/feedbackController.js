const Feedback = require("../models/Feedback");


exports.createFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;


    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }


    const feedback = new Feedback({ rating, comment });
    await feedback.save();


    return res.status(201).json({ message: "Feedback created", feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return res.json({ feedbacks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
