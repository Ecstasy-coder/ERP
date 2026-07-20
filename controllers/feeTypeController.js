const model = require("../models/feeTypeModel");

// Get All

exports.getAll = async(req, res) => {

    try {

        const data = await model.getFeeTypes();

        const formattedData = data.map((item) => ({
            id: item.id,
            fee_type: item.fee_type
        }));

        res.json(formattedData);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

// Get One

exports.getOne = async(req, res) => {

    try {

        const data = await model.getFeeType(req.params.id);

        if (!data) {
            return res.status(404).json({ message: "Fee type not found" });
        }

        res.json({
            id: data.id,
            fee_type: data.fee_type
        });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

// Create

exports.create = async(req, res) => {

    try {

        const { fee_type, is_active } = req.body;

        const data = await model.addFeeType(

            fee_type,

            is_active

        );

        res.status(201).json(data);

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

// Update

exports.update = async(req, res) => {

    try {

        const { fee_type, is_active } = req.body;

        const data = await model.updateFeeType(

            req.params.id,

            fee_type,

            is_active

        );

        res.json({

            message: "Updated Successfully",

            data

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

// Delete

exports.delete = async(req, res) => {

    try {

        await model.deleteFeeType(req.params.id);

        res.json({

            message: "Deleted Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};