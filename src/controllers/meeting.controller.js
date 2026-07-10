const meetingService = require("../services/meeting.service");

// Create Meeting
exports.createMeeting = async (req, res) => {
    try {

        console.log("CREATE BODY:", req.body);

        const meeting = await meetingService.createMeeting(req.body);

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: meeting
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Meetings
exports.getAllMeetings = async (req, res) => {

    try {

        const meetings = await meetingService.getAllMeetings();

        res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Meeting By ID
exports.getMeetingById = async (req, res) => {

    try {

        const meeting = await meetingService.getMeetingById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            data: meeting
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Meeting
exports.updateMeeting = async (req, res) => {

    try {

        console.log("========== UPDATE ==========");
        console.log("Meeting ID:", req.params.id);
        console.log("Request Body:", req.body);
        console.log("============================");

        const meeting = await meetingService.updateMeeting(
            req.params.id,
            req.body
        );

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting updated successfully",
            data: meeting
        });

    } catch (error) {

        console.error("UPDATE ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Cancel Meeting
exports.cancelMeeting = async (req, res) => {

    try {

        const meeting = await meetingService.cancelMeeting(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting cancelled successfully",
            data: meeting
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Meeting
exports.deleteMeeting = async (req, res) => {

    try {

        const meeting = await meetingService.deleteMeeting(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};