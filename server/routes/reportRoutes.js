const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { submitAppBug, submitStationHazard, getMyAppBugReports, getMyStationHazardReports } = require("../controllers/reportController");

// Accept up to 5 files under field name 'media'
router.post("/app-bug", upload.array("media", 5), submitAppBug);
router.post("/station-hazard", upload.array("media", 5), submitStationHazard);
router.get("/app-bug/:userId", getMyAppBugReports);
router.get("/station-hazard/:userId", getMyStationHazardReports);

module.exports = router;
