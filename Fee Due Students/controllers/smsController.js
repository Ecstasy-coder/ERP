const smsModel = require("../models/smsModel");

// =======================================
// Send SMS
// =======================================

const sendSMS = async (req, res) => {

    try {

        const { student_ids } = req.body;

        if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Student IDs are required."

            });

        }

        const smsHistory = await smsModel.sendSMS(student_ids);

        res.status(201).json({

            success: true,

            message: "SMS sent successfully.",

            count: smsHistory.length,

            data: smsHistory

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =======================================
// Get All SMS History
// =======================================

const getSMSHistory = async (req, res) => {

    try {

        const history = await smsModel.getSMSHistory();

        res.status(200).json({

            success: true,

            count: history.length,

            data: history

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =======================================
// Get Student SMS History
// =======================================

const getStudentSMSHistory = async (req, res) => {

    try {

        const history = await smsModel.getStudentSMSHistory(req.params.student_id);

        res.status(200).json({

            success: true,

            count: history.length,

            data: history

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


module.exports = {

    sendSMS,

    getSMSHistory,

    getStudentSMSHistory

};