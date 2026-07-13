const pool = require("../config/db");


// ======================================
// Create Payment
// ======================================

const createPayment = async (

    student_id,
    term_id,
    amount

) => {

    const result = await pool.query(

        `
        INSERT INTO fee_due_payments
        (
            student_id,
            term_id,
            amount
        )

        VALUES ($1,$2,$3)

        RETURNING *;
        `,

        [
            student_id,
            term_id,
            amount
        ]

    );

    return result.rows[0];

};


// ======================================
// Generate Payment Link
// ======================================

const generatePaymentLink = async (payment_id) => {

    const paymentLink =
        `http://localhost:5000/api/payment/pay/${payment_id}`;

    const result = await pool.query(

        `
        UPDATE fee_due_payments

        SET payment_link=$1

        WHERE payment_id=$2

        RETURNING *;
        `,

        [
            paymentLink,
            payment_id
        ]

    );

    return result.rows[0];

};


// ======================================
// Get Payment By Payment ID
// ======================================

const getPaymentById = async (payment_id) => {

    const result = await pool.query(

        `
        SELECT

            fp.payment_id,

            fp.amount,

            fp.payment_status,

            fp.payment_link,

            fp.transaction_id,

            fp.paid_at,

            s.student_name,

            s.father_name,

            s.mobile,

            t.term_name

        FROM fee_due_payments fp

        INNER JOIN fee_due_students s
            ON fp.student_id = s.student_id

        INNER JOIN fee_due_terms t
            ON fp.term_id = t.term_id

        WHERE fp.payment_id=$1;
        `,

        [payment_id]

    );

    return result.rows[0];

};


// ======================================
// Complete Payment
// ======================================

const completePayment = async (payment_id) => {

    const transactionId =
        "TXN" + Date.now();

    const result = await pool.query(

        `
        UPDATE fee_due_payments

        SET

            payment_status='Paid',

            transaction_id=$1,

            paid_at=NOW()

        WHERE payment_id=$2

        RETURNING *;
        `,

        [
            transactionId,
            payment_id
        ]

    );

    return result.rows[0];

};


// ======================================
// Get All Payments
// ======================================

const getAllPayments = async () => {

    const result = await pool.query(

        `
        SELECT *

        FROM fee_due_payments

        ORDER BY created_at DESC;
        `

    );

    return result.rows;

};


module.exports = {

    createPayment,

    generatePaymentLink,

    getPaymentById,

    completePayment,

    getAllPayments

};