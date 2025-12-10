const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { submitAppBug, submitStationHazard } = require("../controllers/reportController");

// Accept up to 5 files under field name 'media'
router.post("/app-bug", upload.array("media", 5), submitAppBug);
router.post("/station-hazard", upload.array("media", 5), submitStationHazard);

module.exports = router;
