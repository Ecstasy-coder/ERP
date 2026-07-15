const classSubjectModel = require("../models/classSubjectModel");

// Get all mappings
const getAllMappings = async (req, res) => {
    console.log("\n==========================================");
    console.log("📥 GET /api/class-subjects");
    console.log("Fetching all class subject mappings...");

    try {
        const mappings = await classSubjectModel.getAllMappings();

        console.log(`✅ Total Records: ${mappings.length}`);
        console.table(mappings);
        console.log("==========================================\n");

        res.status(200).json(mappings);
    } catch (error) {
        console.error("❌ ERROR:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// Add mapping
const addMapping = async (req, res) => {
    console.log("\n==========================================");
    console.log("📥 POST /api/class-subjects");
    console.log("Request Body:");
    console.table([req.body]);

    try {
        const { class_name, subject_name } = req.body;

        const mapping = await classSubjectModel.addMapping(
            class_name,
            subject_name
        );

        console.log("✅ Class Subject Mapping Added Successfully");
        console.table([mapping]);
        console.log("==========================================\n");

        res.status(201).json(mapping);
    } catch (error) {
        console.error("❌ ERROR:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// Update mapping
const updateMapping = async (req, res) => {
    console.log("\n==========================================");
    console.log(`📥 PUT /api/class-subjects/${req.params.id}`);
    console.log("Request Body:");
    console.table([req.body]);

    try {
        const { id } = req.params;
        const { class_name, subject_name } = req.body;

        const mapping = await classSubjectModel.updateMapping(
            id,
            class_name,
            subject_name
        );

        if (!mapping) {
            return res.status(404).json({
                message: "Class Subject Mapping not found"
            });
        }

        console.log("✅ Class Subject Mapping Updated Successfully");
        console.table([mapping]);
        console.log("==========================================\n");

        res.status(200).json(mapping);
    } catch (error) {
        console.error("❌ UPDATE ERROR:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// Delete mapping
const deleteMapping = async (req, res) => {
    console.log("\n==========================================");
    console.log(`📥 DELETE /api/class-subjects/${req.params.id}`);

    try {
        const { id } = req.params;

        const mapping = await classSubjectModel.deleteMapping(id);

        if (!mapping) {
            return res.status(404).json({
                message: "Class Subject Mapping not found"
            });
        }

        console.log("✅ Class Subject Mapping Deleted Successfully");
        console.table([mapping]);
        console.log("==========================================\n");

        res.status(200).json({
            message: "Class Subject Mapping deleted successfully",
            mapping
        });
    } catch (error) {
        console.error("❌ DELETE ERROR:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllMappings,
    addMapping,
    updateMapping,
    deleteMapping
};