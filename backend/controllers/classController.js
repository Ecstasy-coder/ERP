const model = require("../models/classModel");

exports.getAll = async (req, res) => {
    try {
        const data = await model.getClasses();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const data = await model.getClass(req.params.id);

        if (!data) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { class_name, is_active } = req.body;

        const data = await model.addClass(class_name, is_active);

        res.status(201).json(data);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {

        const { class_name, is_active } = req.body;

        const data = await model.updateClass(
            req.params.id,
            class_name,
            is_active
        );

        if (!data) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.json({
            message: "Updated Successfully",
            data
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {

    try {

        await model.deleteClass(req.params.id);

        res.json({
            message: "Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};