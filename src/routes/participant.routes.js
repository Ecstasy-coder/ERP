const express = require("express");
const router = express.Router();

const participantController = require("../controllers/participant.controller");

// Add Participant
router.post("/", participantController.addParticipant);

// Get Participants by Meeting ID
router.get("/:meetingId", participantController.getParticipants);

// Delete Participant
router.delete("/:id", participantController.deleteParticipant);

module.exports = router;