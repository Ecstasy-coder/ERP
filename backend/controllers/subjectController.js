const subjectModel = require("../models/subjectModel");

// GET all subjects
const getSubjects = async (req, res) => {
    console.log("\n========================================");
    console.log("📥 GET /api/subjects");
    console.log("Fetching all subjects...");

    try {
        const subjects = await subjectModel.getAllSubjects();

        console.log(`✅ Success! Total Subjects: ${subjects.length}`);
        console.log("========================================\n");

        res.status(200).json(subjects);
    } catch (error) {
        console.error("❌ Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// POST subject
const createSubject = async (req, res) => {
    console.log("\n========================================");
    console.log("📥 POST /api/subjects");
    console.log("Request Body:");
    console.log(req.body);

    try {
        const { subject_title, is_language, is_active } = req.body;

        const subject = await subjectModel.addSubject(
            subject_title,
            is_language,
            is_active
        );

        console.log("✅ Subject Added Successfully");
        console.log(subject);
        console.log("========================================\n");

        res.status(201).json(subject);
    } catch (error) {
        console.error("❌ Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// PUT subject
const updateSubject = async (req, res) => {
    console.log("\n========================================");
    console.log(`📥 PUT /api/subjects/${req.params.id}`);
    console.log("Request Body:");
    console.log(req.body);

    try {
        const { id } = req.params;
        const { subject_title, is_language, is_active } = req.body;

        const subject = await subjectModel.updateSubject(
            id,
            subject_title,
            is_language,
            is_active
        );

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        console.log("✅ Subject Updated Successfully");
        console.log(subject);
        console.log("========================================\n");

        res.status(200).json(subject);
    } catch (error) {
        console.error("❌ Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE subject
const deleteSubject = async (req, res) => {
    console.log("\n========================================");
    console.log(`📥 DELETE /api/subjects/${req.params.id}`);

    try {
        const { id } = req.params;

        const subject = await subjectModel.deleteSubject(id);

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        console.log("✅ Subject Deleted Successfully");
        console.log(subject);
        console.log("========================================\n");

        res.status(200).json({
            message: "Subject deleted successfully",
            subject
        });
    } catch (error) {
        console.error("❌ Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject
};