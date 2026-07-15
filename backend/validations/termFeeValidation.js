const validateTermFee = (req, res, next) => {

    console.log("Term Fee Validation Executed");

    console.log(req.body);

    const {

        branch_id,

        academic_year_id,

        class_id,

        term_name,

        term_amount,

        due_date

    } = req.body;


    // ===========================
    // Branch Validation
    // ===========================
    if (!branch_id) {

        return res.status(400).json({

            success: false,

            message: "Branch is required"

        });

    }


    // ===========================
    // Academic Year Validation
    // ===========================
    if (!academic_year_id) {

        return res.status(400).json({

            success: false,

            message: "Academic Year is required"

        });

    }


    // ===========================
    // Class Validation
    // ===========================
    if (!class_id) {

        return res.status(400).json({

            success: false,

            message: "Class is required"

        });

    }


    // ===========================
    // Term Name Validation
    // ===========================
    if (!term_name || term_name.trim() === "") {

        return res.status(400).json({

            success: false,

            message: "Term Name is required"

        });

    }


    // ===========================
    // Term Amount Validation
    // ===========================
    if (

        term_amount === undefined ||

        term_amount === null ||

        term_amount === ""

    ) {

        return res.status(400).json({

            success: false,

            message: "Term Amount is required"

        });

    }

    if (isNaN(term_amount)) {

        return res.status(400).json({

            success: false,

            message: "Term Amount must be numeric"

        });

    }

    if (Number(term_amount) <= 0) {

        return res.status(400).json({

            success: false,

            message: "Term Amount must be greater than zero"

        });

    }


    // ===========================
    // Due Date Validation
    // ===========================
    if (!due_date) {

        return res.status(400).json({

            success: false,

            message: "Due Date is required"

        });

    }


    next();

};

module.exports = validateTermFee;