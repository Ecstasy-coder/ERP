const reportModel = require("../models/reportModel");

// =======================================
// Fee Due Report
// =======================================

const getFeeDueReport = async (req, res) => {

    try {

        const report = await reportModel.getFeeDueReport();

        res.status(200).json({

            success: true,

            count: report.length,

            data: report

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
// Payment Report
// =======================================

const getPaymentReport = async (req, res) => {

    try {

        const report = await reportModel.getPaymentReport();

        res.status(200).json({

            success: true,

            count: report.length,

            data: report

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
// Student Report
// =======================================

const getStudentReport = async (req, res) => {

    try {

        const report = await reportModel.getStudentReport(req.params.id);

        res.status(200).json({

            success: true,

            count: report.length,

            data: report

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
// Branch Report
// =======================================

const getBranchReport = async (req, res) => {

    try {

        const report = await reportModel.getBranchReport(req.params.id);

        res.status(200).json({

            success: true,

            count: report.length,

            data: report

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

    getFeeDueReport,

    getPaymentReport,

    getStudentReport,

    getBranchReport

};