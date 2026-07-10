const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meeting.controller");

// Get All Meetings
router.get("/", meetingController.getAllMeetings);

// Get Meeting By ID
router.get("/:id", meetingController.getMeetingById);

// Create Meeting
router.post("/", meetingController.createMeeting);

// Update Meeting
router.put("/:id", meetingController.updateMeeting);

// Cancel Meeting
router.patch("/:id/cancel", meetingController.cancelMeeting);

// Delete Meeting
router.delete("/:id", meetingController.deleteMeeting);

module.exports = router;