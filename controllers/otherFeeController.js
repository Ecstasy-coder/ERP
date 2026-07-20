const otherFeeModel = require("../models/otherFeeModel");

const getAllOtherFees = async(req, res) => {

    try {

        const result = await otherFeeModel.getAllOtherFees();

        res.status(200).json({

            success: true,
            message: "Other Fees Fetched Successfully",
            data: result

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

const addOtherFee = async(req, res) => {

    try {

        const result = await otherFeeModel.addOtherFee(req.body);

        res.status(201).json({

            success: true,
            message: "Other Fee Added Successfully",

            data: result

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

module.exports = {

    getAllOtherFees,
    addOtherFee

};