const TermFeeService = require("../services/termFeeService");


// =======================================
// Get All Term Fees
// =======================================
const getTermFees = async (req, res) => {

    try {

        const termFees = await TermFeeService.getTermFees();

        res.status(200).json({

            success: true,

            message: "Term Fees fetched successfully",

            data: termFees

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message,

            code: error.code,

            detail: error.detail

        });

    }

};


// =======================================
// Get Term Fee By ID
// =======================================
const getTermFeeById = async (req, res) => {

    try {

        const { id } = req.params;

        const termFee = await TermFeeService.getTermFeeById(id);

        if (!termFee) {

            return res.status(404).json({

                success: false,

                message: "Term Fee not found"

            });

        }

        res.status(200).json({

            success: true,

            data: termFee

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message,

            code: error.code,

            detail: error.detail

        });

    }

};


// =======================================
// Create Term Fee
// =======================================
const createTermFee = async (req, res) => {

    try {

        const termFee = await TermFeeService.createTermFee(req.body);

        res.status(201).json({

            success: true,

            message: "Term Fee Created Successfully",

            data: termFee

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message,

            code: error.code,

            detail: error.detail

        });

    }

};


// =======================================
// Update Term Fee
// =======================================
const updateTermFee = async (req, res) => {

    try {

        const { id } = req.params;

        const termFee = await TermFeeService.updateTermFee(id, req.body);

        if (!termFee) {

            return res.status(404).json({

                success: false,

                message: "Term Fee not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Term Fee Updated Successfully",

            data: termFee

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message,

            code: error.code,

            detail: error.detail

        });

    }

};


// =======================================
// Delete Term Fee
// =======================================
const deleteTermFee = async (req, res) => {

    try {

        const { id } = req.params;

        const termFee = await TermFeeService.deleteTermFee(id);

        if (!termFee) {

            return res.status(404).json({

                success: false,

                message: "Term Fee not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Term Fee Deleted Successfully",

            data: termFee

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message,

            code: error.code,

            detail: error.detail

        });

    }

};


module.exports = {

    getTermFees,

    getTermFeeById,

    createTermFee,

    updateTermFee,

    deleteTermFee

};