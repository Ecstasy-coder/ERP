const classModel = require("../models/classModel");

// Create
const createClass = async (req, res) => {

    try {

        const { class_name } = req.body;

        if (!class_name) {

            return res.status(400).json({
                success: false,
                message: "Class name is required."
            });

        }

        const newClass = await classModel.createClass(class_name);

        res.status(201).json({

            success: true,
            message: "Class created successfully.",
            data: newClass

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: "Unable to create class."

        });

    }

};

// Get All
const getClasses = async (req, res) => {

    try {

        const classes = await classModel.getAllClasses();

        res.json({

            success: true,
            count: classes.length,
            data: classes

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: "Unable to fetch classes."

        });

    }

};

// Get One
const getClass = async (req, res) => {

    try {

        const singleClass = await classModel.getClassById(req.params.id);

        if (!singleClass) {

            return res.status(404).json({

                success: false,
                message: "Class not found."

            });

        }

        res.json({

            success: true,
            data: singleClass

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// Update
const updateClass = async (req, res) => {

    try {

        const { class_name } = req.body;

        const updated = await classModel.updateClass(
            req.params.id,
            class_name
        );

        res.json({

            success: true,
            message: "Class updated successfully.",
            data: updated

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: "Unable to update class."

        });

    }

};

// Delete
const deleteClass = async (req, res) => {

    try {

        await classModel.deleteClass(req.params.id);

        res.json({

            success: true,
            message: "Class deleted successfully."

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: "Unable to delete class."

        });

    }

};

module.exports = {

    createClass,
    getClasses,
    getClass,
    updateClass,
    deleteClass

};