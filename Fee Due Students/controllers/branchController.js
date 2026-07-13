const branchModel = require("../models/branchModel");

// Create Branch
const createBranch = async (req, res) => {

    try {

        const { branch_name, branch_code } = req.body;

        if (!branch_name || !branch_code) {
            return res.status(400).json({
                success: false,
                message: "Branch name and branch code are required."
            });
        }

        const branch = await branchModel.createBranch(
            branch_name,
            branch_code
        );

        res.status(201).json({
            success: true,
            message: "Branch created successfully.",
            data: branch
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to create branch."
        });

    }

};

// Get All Branches
const getBranches = async (req, res) => {

    try {

        const branches = await branchModel.getAllBranches();

        res.status(200).json({
            success: true,
            count: branches.length,
            data: branches
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch branches."
        });

    }

};

// Get Single Branch
const getBranch = async (req, res) => {

    try {

        const branch = await branchModel.getBranchById(req.params.id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found."
            });
        }

        res.json({
            success: true,
            data: branch
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// Update Branch
const updateBranch = async (req, res) => {

    try {

        const { branch_name, branch_code } = req.body;

        const branch = await branchModel.updateBranch(
            req.params.id,
            branch_name,
            branch_code
        );

        res.json({
            success: true,
            message: "Branch updated successfully.",
            data: branch
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Unable to update branch."
        });

    }

};

// Delete Branch
const deleteBranch = async (req, res) => {

    try {

        await branchModel.deleteBranch(req.params.id);

        res.json({
            success: true,
            message: "Branch deleted successfully."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Unable to delete branch."
        });

    }

};

module.exports = {
    createBranch,
    getBranches,
    getBranch,
    updateBranch,
    deleteBranch
};