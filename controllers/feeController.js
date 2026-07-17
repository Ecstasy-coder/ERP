const pool = require("../config/db");

/**
 * ============================================
 * Get All Fee Types
 * ============================================
 */

const getFeeTypes = async(req, res) => {
    try {

        const result = await pool.query(`
            SELECT fee_type
            FROM fee_types
            WHERE is_active = TRUE
            ORDER BY fee_type ASC
        `);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch fee types"
        });

    }
};


/**
 * ============================================
 * Add Student Fee
 * ============================================
 */

const addStudentFee = async(req, res) => {

    try {

        const {

            student_id,
            fee_type,
            fee_amount,
            discount_amount

        } = req.body;


        if (!student_id || !fee_type || !fee_amount) {

            return res.status(400).json({

                success: false,
                message: "Student, Fee Type and Fee Amount are required."

            });

        }


        const feeAmount = Number(fee_amount);

        const discount = Number(discount_amount || 0);

        const subtotal = feeAmount - discount;

        const feeBalance = subtotal;


        const query = `

            INSERT INTO student_fee_details
            (
                student_id,
                fee_type,
                transport_type,
                fee_amount,
                discount_amount,
                subtotal_amount,
                fee_paid,
                fee_balance
            )

            VALUES
            (
                $1,
                $2,
                'Two Way',
                $3,
                $4,
                $5,
                0,
                $6
            )

            RETURNING *;

        `;


        const values = [

            student_id,
            fee_type,
            feeAmount,
            discount,
            subtotal,
            feeBalance

        ];


        const result = await pool.query(query, values);


        res.status(201).json({

            success: true,
            message: "Fee Added Successfully",

            data: result.rows[0]

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Unable to save fee."

        });

    }

};



/**
 * ============================================
 * Get Fee Details By Student
 * ============================================
 */

const getStudentFees = async(req, res) => {

    try {

        const { studentId } = req.params;

        const result = await pool.query(

            `

            SELECT *

            FROM student_fee_details

            WHERE student_id = $1

            ORDER BY id DESC

            `,

            [studentId]

        );


        res.status(200).json({

            success: true,

            count: result.rows.length,

            data: result.rows

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to fetch fee details."

        });

    }

};



/**
 * ============================================
 * Update Fee Payment
 * ============================================
 */

const payFee = async(req, res) => {

    try {

        const { id } = req.params;

        const { amount } = req.body;

        const payment = Number(amount);

        const fee = await pool.query(

            `

            SELECT *

            FROM student_fee_details

            WHERE id = $1

            `,

            [id]

        );


        if (fee.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Fee record not found."

            });

        }


        const record = fee.rows[0];

        const newPaid = Number(record.fee_paid) + payment;

        const newBalance = Number(record.subtotal_amount) - newPaid;


        const result = await pool.query(

            `

            UPDATE student_fee_details

            SET

                fee_paid = $1,

                fee_balance = $2,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $3

            RETURNING *

            `,

            [

                newPaid,

                newBalance,

                id

            ]

        );


        res.status(200).json({

            success: true,

            message: "Fee Paid Successfully",

            data: result.rows[0]

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to update payment."

        });

    }

};



/**
 * ============================================
 * Delete Fee
 * ============================================
 */

const deleteFee = async(req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `

            DELETE FROM student_fee_details

            WHERE id = $1

            RETURNING *

            `,

            [id]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Fee record not found."

            });

        }


        res.status(200).json({

            success: true,

            message: "Fee Deleted Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to delete fee."

        });

    }

};



module.exports = {

    getFeeTypes,

    addStudentFee,

    getStudentFees,

    payFee,

    deleteFee

};