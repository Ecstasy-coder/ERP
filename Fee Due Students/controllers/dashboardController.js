const dashboardModel = require("../models/dashboardModel");

// =======================================
// Dashboard Summary
// =======================================

const getDashboardSummary = async (req, res) => {

    try {

        const summary = await dashboardModel.getDashboardSummary();

        res.status(200).json({

            success: true,

            data: summary

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
// Branch Dashboard
// =======================================

const getBranchDashboard = async (req, res) => {

    try {

        const branches = await dashboardModel.getBranchDashboard();

        res.status(200).json({

            success: true,

            count: branches.length,

            data: branches

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
// Class Dashboard
// =======================================

const getClassDashboard = async (req, res) => {

    try {

        const classes = await dashboardModel.getClassDashboard();

        res.status(200).json({

            success: true,

            count: classes.length,

            data: classes

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
// Recent Payments
// =======================================

const getRecentPayments = async (req, res) => {

    try {

        const payments = await dashboardModel.getRecentPayments();

        res.status(200).json({

            success: true,

            count: payments.length,

            data: payments

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

    getDashboardSummary,

    getBranchDashboard,

    getClassDashboard,

    getRecentPayments

};