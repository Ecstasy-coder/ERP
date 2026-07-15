const validateFeeStructure = (req, res, next) => {

    console.log("Fee Structure Validation Executed");

    console.log(req.body);

    const {

        branch_id,

        academic_year_id,

        
        class_id,

        fee_type_id,

        fee_amount

    } = req.body;

    // ============================
    // Branch Validation
    // ============================
    if (!branch_id) {

        return res.status(400).json({

            success: false,

            message: "Branch is required"

        });

    }

    // ============================
    // Academic Year Validation
    // ============================
    if (!academic_year_id) {

        return res.status(400).json({

            success: false,

            message: "Academic Year is required"

        });

    }

    // ============================
    // Class Validation
    // ============================
    if (!class_id) {

        return res.status(400).json({

            success: false,

            message: "Class is required"

        });

    }

    // ============================
    // Fee Type Validation
    // ============================
    if (!fee_type_id) {

        return res.status(400).json({

            success: false,

            message: "Fee Type is required"

        });

    }

    // ============================
    // Fee Amount Validation
    // ============================
    if (
        fee_amount === undefined ||
        fee_amount === null ||
        fee_amount === ""
    ) {

        return res.status(400).json({

            success: false,

            message: "Fee Amount is required"

        });

    }

    if (isNaN(fee_amount)) {

        return res.status(400).json({

            success: false,

            message: "Fee Amount must be numeric"

        });

    }

    if (Number(fee_amount) <= 0) {

        return res.status(400).json({

            success: false,

            message: "Fee Amount must be greater than zero"

        });

    }

    next();

};

module.exports = validateFeeStructure;