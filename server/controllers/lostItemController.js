const LostItem = require("../models/LostItem");

const getAllLostItems = async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching lost items:", error);
    res.status(500).json({ message: "Server error. Unable to fetch lost items." });
  }
};

const createLostItem = async (req, res) => {
  try {
    const { questions } = req.body;

    // Parse questions safely
    let parsedQuestions = [];
    try {
      parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;
    } catch {
      parsedQuestions = [];
    }

    const item = new LostItem({
      ...req.body,
      questions: parsedQuestions,
    });

    if (req.files?.length) {
      item.photos = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const savedItem = await item.save();
    res.status(201).json({
      message: "Lost item created successfully!",
      item: savedItem,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(400).json({ message: "Failed to create lost item", error: error.message });
  }
};

const updateLostItem = async (req, res) => {
  try {
    const updatedItem = await LostItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.status(200).json({
      message: "Lost item updated successfully!",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: "Failed to update lost item", error: error.message });
  }
};

const deleteLostItem = async (req, res) => {
  try {
    const deletedItem = await LostItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.status(200).json({ message: "Lost item deleted successfully!" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete lost item" });
  }
};

const verifyClaim = async (req, res) => {
  try {
    const { answers } = req.body;
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    if (!item.questions?.length) {
      return res.status(400).json({ message: "No verification questions set" });
    }

    for (let i = 0; i < item.questions.length; i++) {
      const submitted = (answers[i]?.answer || "").trim().toLowerCase();
      const expected = (item.questions[i].answer || "").trim().toLowerCase();
      if (submitted !== expected) {
        return res.status(403).json({ message: `Verification failed at question ${i + 1}` });
      }
    }

    item.status = "claimed";
    await item.save();

    res.status(200).json({
      message: "Verification passed. Item claimed successfully!",
      item,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).json({ message: "Verification error", error: error.message });
  }
};

module.exports = {
  getAllLostItems,
  createLostItem,
  updateLostItem,
  deleteLostItem,
  verifyClaim,
};
