const participantRepository = require("../repositories/participant.repository");

// Add Participant
exports.addParticipant = async (data) => {

    if (!data.meetingId)
        throw new Error("Meeting ID is required");

    if (!data.participantType)
        throw new Error("Participant Type is required");

    return await participantRepository.addParticipant(data);
};

// Get Participants
exports.getParticipants = async (meetingId) => {

    return await participantRepository.getParticipants(meetingId);
};

// Delete Participant
exports.deleteParticipant = async (id) => {

    return await participantRepository.deleteParticipant(id);
};