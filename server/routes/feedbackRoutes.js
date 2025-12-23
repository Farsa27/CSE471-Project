const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback } = require("../controllers/feedbackController");

// POST /api/feedback  - create new feedback
router.post("/", createFeedback);

// GET /api/feedback - list all feedbacks
router.get("/", getAllFeedback);

module.exports = router;
