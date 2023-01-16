const express = require("express");
const router = express.Router();

const { getSchedule, calculateSchedule } = require("../controllers/schedule");

router.route("/:userId").get(getSchedule);
router.route("/:userId").post(calculateSchedule);

module.exports = router;
