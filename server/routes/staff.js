const express = require("express");
const {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff
} = require("../controllers/staffController");

const router = express.Router();

router.get("/", getAllStaff);
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;
