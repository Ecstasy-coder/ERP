const classSectionService = require("../services/classSectionService");

// ======================
// GET ALL CLASS SECTIONS
// ======================
const getAllClassSections = async (req, res) => {
    try {
        const sections = await classSectionService.getAllClassSections();

        res.status(200).json({
            success: true,
            count: sections.length,
            data: sections,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================
// GET CLASS SECTION BY ID
// ======================
const getClassSectionById = async (req, res) => {
    try {
        const section = await classSectionService.getClassSectionById(req.params.id);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Class Section not found",
            });
        }

        res.status(200).json({
            success: true,
            data: section,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================
// CREATE CLASS SECTION
// ======================
const createClassSection = async (req, res) => {
    try {
        const section = await classSectionService.createClassSection(req.body);

        res.status(201).json({
            success: true,
            data: section,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================
// UPDATE CLASS SECTION
// ======================
const updateClassSection = async (req, res) => {
    try {
        const section = await classSectionService.updateClassSection(
            req.params.id,
            req.body
        );

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Class Section not found",
            });
        }

        res.status(200).json({
            success: true,
            data: section,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================
// DELETE CLASS SECTION
// ======================
const deleteClassSection = async (req, res) => {
    try {
        const section = await classSectionService.deleteClassSection(req.params.id);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Class Section not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Class Section deleted successfully",
            data: section,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllClassSections,
    getClassSectionById,
    createClassSection,
    updateClassSection,
    deleteClassSection,
};