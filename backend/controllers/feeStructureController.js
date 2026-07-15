// const FeeStructureService = require("../services/feeStructureService");


// // =======================================
// // Get Fee Structure
// // =======================================
// const getFeeStructure = async (req, res) => {

//     try {

//         const {

//             branch_id,

//             academic_year_id,

//             class_id

//         } = req.query;

//         const feeStructure = await FeeStructureService.getFeeStructure(

//             branch_id,

//             academic_year_id,

//             class_id

//         );

//         res.status(200).json(feeStructure);

//     } catch (error) {

//     console.error(error);

//     res.status(500).json({

//         success: false,

//         message: error.message,
//         code: error.code,
//         detail: error.detail

//     });

// }

// };


// // =======================================
// // Create Fee Structure
// // =======================================
// const createFeeStructure = async (req, res) => {

//     try {

//         const feeStructure = await FeeStructureService.createFeeStructure(req.body);

//         res.status(201).json({

//             success: true,

//             message: "Fee Structure Created Successfully",

//             data: feeStructure

//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({

//             success: false,

//             message: error.message,

//             code: error.code,

//             detail: error.detail

//         });

//     }

// };


// // =======================================
// // Update Fee Structure
// // =======================================
// const updateFeeStructure = async (req, res) => {

//     try {

//         const { id } = req.params;

//         const { fee_amount } = req.body;

//         const feeStructure = await FeeStructureService.updateFeeStructure(

//             id,

//             fee_amount

//         );

//         if (!feeStructure) {

//             return res.status(404).json({

//                 success: false,

//                 message: "Fee Structure not found"

//             });

//         }

//         res.status(200).json({

//             success: true,

//             message: "Fee Structure Updated Successfully",

//             data: feeStructure

//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({

//             success: false,

//             message: "Failed to update Fee Structure"

//         });

//     }

// };


// // =======================================
// // Delete Fee Structure
// // =======================================
// const deleteFeeStructure = async (req, res) => {

//     try {

//         const { id } = req.params;

//         const feeStructure = await FeeStructureService.deleteFeeStructure(id);

//         if (!feeStructure) {

//             return res.status(404).json({

//                 success: false,

//                 message: "Fee Structure not found"

//             });

//         }

//         res.status(200).json({

//             success: true,

//             message: "Fee Structure Deleted Successfully"

//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({

//             success: false,

//             message: "Failed to delete Fee Structure"

//         });

//     }

// };


// // =======================================
// // Get Total Fee
// // =======================================
// const getTotalFee = async (req, res) => {

//     try {

//         const {

//             branch_id,

//             academic_year_id,

//             class_id

//         } = req.query;

//         const totalFee = await FeeStructureService.getTotalFee(

//             branch_id,

//             academic_year_id,

//             class_id

//         );

//         res.status(200).json({

//             success: true,

//             total_fee: totalFee.total_fee

//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({

//             success: false,

//             message: "Failed to calculate Total Fee"

//         });

//     }

// };


// module.exports = {

//     getFeeStructure,

//     createFeeStructure,

//     updateFeeStructure,

//     deleteFeeStructure,

//     getTotalFee

// };
const FeeStructureService = require("../services/feeStructureService");

// =======================================
// Get All Fee Structures
// =======================================
const getFeeStructure = async (req, res) => {

    try {

        const feeStructure = await FeeStructureService.getFeeStructure();

        res.status(200).json({
            success: true,
            message: "Fee Structure fetched successfully",
            data: feeStructure
        });

    } catch (error) {

        console.error("GET ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================================
// Get Fee Structure By ID
// =======================================
const getFeeStructureById = async (req, res) => {

    try {

        const { id } = req.params;

        const feeStructure = await FeeStructureService.getFeeStructureById(id);

        if (!feeStructure) {

            return res.status(404).json({
                success: false,
                message: "Fee Structure not found"
            });

        }

        res.status(200).json({
            success: true,
            data: feeStructure
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =======================================
// Create Fee Structure
// =======================================
const createFeeStructure = async (req, res) => {

    try {

        const feeStructure = await FeeStructureService.createFeeStructure(req.body);

        res.status(201).json({

            success: true,

            message: "Fee Structure Created Successfully",

            data: feeStructure

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
// Update Fee Structure
// =======================================
const updateFeeStructure = async (req, res) => {

    try {

        const { id } = req.params;

        const { fee_amount } = req.body;

        const feeStructure = await FeeStructureService.updateFeeStructure(

            id,

            fee_amount

        );

        if (!feeStructure) {

            return res.status(404).json({

                success: false,

                message: "Fee Structure not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Fee Structure Updated Successfully",

            data: feeStructure

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// Delete Fee Structure
// =======================================
const deleteFeeStructure = async (req, res) => {

    try {

        const { id } = req.params;

        const feeStructure = await FeeStructureService.deleteFeeStructure(id);

        if (!feeStructure) {

            return res.status(404).json({

                success: false,

                message: "Fee Structure not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Fee Structure Deleted Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// Get Total Fee
// =======================================
const getTotalFee = async (req, res) => {

    try {

        const {

            branch_id,

            academic_year_id,

            class_id

        } = req.query;

        const totalFee = await FeeStructureService.getTotalFee(

            branch_id,

            academic_year_id,

            class_id

        );

        res.status(200).json({

            success: true,

            total_fee: totalFee.total_fee

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {

    getFeeStructure,

    getFeeStructureById,

    createFeeStructure,

    updateFeeStructure,

    deleteFeeStructure,

    getTotalFee

};