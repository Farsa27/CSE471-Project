const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload"); // your multer
const {
  createLostItem,
  getAllLostItems,
  verifyClaim, // this is key for claiming
  updateLostItem,
  deleteLostItem,
} = require('../controllers/lostItemController');

router.post('/', upload.array('photos', 4), createLostItem);
router.get('/', getAllLostItems);
router.post('/:id/claim', verifyClaim); // ← This enables claiming with questions
router.put('/:id', upload.array('photos', 4), updateLostItem);
router.delete('/:id', deleteLostItem);

module.exports = router;