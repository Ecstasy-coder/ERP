const Branch = require("../models/branchModel");
console.log("Branch Controller Loaded");
// =========================
// GET ALL
// =========================
const getBranches = async (req, res) => {

    try {

        const branches = await Branch.getAllBranches();

        res.status(200).json({
            success: true,
            data: branches
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// GET BY ID
// =========================
const getBranchById = async (req, res) => {

    try {

        const branch = await Branch.getBranchById(req.params.id);

        if (!branch) {

            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });

        }

        res.status(200).json({
            success: true,
            data: branch
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// CREATE
// =========================
const createBranch = async (req, res) => {

    try {

        const branch = await Branch.createBranch(req.body);

        res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: branch
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// UPDATE
// =========================
const updateBranch = async (req, res) => {
console.log("BODY =", req.body);
    console.log("PARAM =", req.params.id);
    try {

        const branch = await Branch.updateBranch(
            req.params.id,
            req.body
        );

        if (!branch) {

            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            data: branch
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================
// DELETE
// =========================
const deleteBranch = async (req, res) => {

    try {

        const branch = await Branch.deleteBranch(req.params.id);

        if (!branch) {

            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Branch deleted successfully"
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
    getBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch
};