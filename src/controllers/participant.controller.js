const participantService = require("../services/participant.service");

// Add Participant
exports.addParticipant = async (req, res) => {
    try {
        const participant = await participantService.addParticipant(req.body);

        res.status(201).json({
            success: true,
            message: "Participant added successfully",
            data: participant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Participants
exports.getParticipants = async (req, res) => {
    try {
        const participants = await participantService.getParticipants(req.params.meetingId);

        res.status(200).json({
            success: true,
            count: participants.length,
            data: participants
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Participant
exports.deleteParticipant = async (req, res) => {
    try {

        const participant = await participantService.deleteParticipant(req.params.id);

        if (!participant) {
            return res.status(404).json({
                success: false,
                message: "Participant not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Participant removed successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};