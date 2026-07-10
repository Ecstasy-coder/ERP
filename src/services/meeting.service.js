const meetingRepository = require("../repositories/meeting.repository");

// Create Meeting
exports.createMeeting = async (meetingData) => {

    if (!meetingData.title)
        throw new Error("Title is required");

    if (!meetingData.meetingDate)
        throw new Error("Meeting Date is required");

    if (!meetingData.startTime)
        throw new Error("Start Time is required");

    if (!meetingData.endTime)
        throw new Error("End Time is required");

    return await meetingRepository.createMeeting(meetingData);

};

// Get All Meetings
exports.getAllMeetings = async () => {

    return await meetingRepository.getAllMeetings();

};

// Get Meeting By ID
exports.getMeetingById = async (id) => {

    return await meetingRepository.getMeetingById(id);

};

// Update Meeting
exports.updateMeeting = async (id, meetingData) => {

    return await meetingRepository.updateMeeting(id, meetingData);

};

// Cancel Meeting
exports.cancelMeeting = async (id) => {

    return await meetingRepository.cancelMeeting(id);

};

// Delete Meeting
exports.deleteMeeting = async (id) => {

    return await meetingRepository.deleteMeeting(id);

};