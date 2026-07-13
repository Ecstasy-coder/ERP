const feeDueModel = require("../models/feeDueModel");

// =======================================
// Create Fee Due
// =======================================

const createFeeDue = async (req, res) => {

    try {

        const {
            student_id,
            term_id,
            fee_due
        } = req.body;

        if (!student_id || !term_id || fee_due == null) {

            return res.status(400).json({
                success: false,
                message: "Student, Term and Fee Due are required."
            });

        }

        const feeDue = await feeDueModel.createFeeDue(
            student_id,
            term_id,
            fee_due
        );

        res.status(201).json({
            success: true,
            message: "Fee Due created successfully.",
            data: feeDue
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
// Get All Fee Due
// =======================================

const getAllFeeDue = async (req, res) => {

    try {

        const feeDue = await feeDueModel.getAllFeeDue();

        res.status(200).json({
            success: true,
            count: feeDue.length,
            data: feeDue
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
// ERP Fee Due List
// =======================================

const getFeeDueList = async (req, res) => {

    try {

        const feeDueList = await feeDueModel.getFeeDueList();

        res.status(200).json({

            success: true,

            count: feeDueList.length,

            data: feeDueList

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
// Dynamic Filter
// =======================================

const filterFeeDue = async (req, res) => {

    try {

        const {

            branch_id,
            class_id,
            term_id,
            payment_status,
            keyword

        } = req.query;

        const feeDue = await feeDueModel.filterFeeDue(

            branch_id,
            class_id,
            term_id,
            payment_status,
            keyword

        );

        res.status(200).json({

            success: true,

            count: feeDue.length,

            data: feeDue

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
// Search Fee Due
// =======================================

const searchFeeDue = async (req, res) => {

    try {

        const { keyword } = req.query;

        if (!keyword) {

            return res.status(400).json({

                success: false,

                message: "Search keyword is required."

            });

        }

        const feeDue = await feeDueModel.searchFeeDue(keyword);

        res.status(200).json({

            success: true,

            count: feeDue.length,

            data: feeDue

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
// Get Fee Due By ID
// =======================================

const getFeeDueById = async (req, res) => {

    try {

        const feeDue = await feeDueModel.getFeeDueById(req.params.id);

        if (!feeDue) {

            return res.status(404).json({

                success: false,

                message: "Fee Due record not found."

            });

        }

        res.status(200).json({

            success: true,

            data: feeDue

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
// Update Fee Due
// =======================================

const updateFeeDue = async (req, res) => {

    try {

        const {

            student_id,
            term_id,
            fee_due

        } = req.body;

        const updated = await feeDueModel.updateFeeDue(

            req.params.id,
            student_id,
            term_id,
            fee_due

        );

        if (!updated) {

            return res.status(404).json({

                success: false,

                message: "Fee Due record not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Fee Due updated successfully.",

            data: updated

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
// Delete Fee Due
// =======================================

const deleteFeeDue = async (req, res) => {

    try {

        const deleted = await feeDueModel.deleteFeeDue(req.params.id);

        if (!deleted) {

            return res.status(404).json({

                success: false,

                message: "Fee Due record not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Fee Due deleted successfully."

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

    createFeeDue,

    getAllFeeDue,

    getFeeDueList,

    filterFeeDue,

    searchFeeDue,

    getFeeDueById,

    updateFeeDue,

    deleteFeeDue

};