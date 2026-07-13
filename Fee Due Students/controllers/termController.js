const termModel = require("../models/termModel");

// Create Term
const createTerm = async (req, res) => {
    try {

        const { term_name } = req.body;

        if (!term_name) {
            return res.status(400).json({
                success: false,
                message: "Term name is required."
            });
        }

        const term = await termModel.createTerm(term_name);

        res.status(201).json({
            success: true,
            message: "Term created successfully.",
            data: term
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to create term."
        });

    }
};

// Get All Terms
const getTerms = async (req, res) => {
    try {

        const terms = await termModel.getAllTerms();

        res.status(200).json({
            success: true,
            count: terms.length,
            data: terms
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch terms."
        });

    }
};

// Get Single Term
const getTerm = async (req, res) => {
    try {

        const term = await termModel.getTermById(req.params.id);

        if (!term) {
            return res.status(404).json({
                success: false,
                message: "Term not found."
            });
        }

        res.json({
            success: true,
            data: term
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// Update Term
const updateTerm = async (req, res) => {
    try {

        const { term_name } = req.body;

        const term = await termModel.updateTerm(
            req.params.id,
            term_name
        );

        res.json({
            success: true,
            message: "Term updated successfully.",
            data: term
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to update term."
        });

    }
};

// Delete Term
const deleteTerm = async (req, res) => {
    try {

        await termModel.deleteTerm(req.params.id);

        res.json({
            success: true,
            message: "Term deleted successfully."
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to delete term."
        });

    }
};

module.exports = {
    createTerm,
    getTerms,
    getTerm,
    updateTerm,
    deleteTerm
};