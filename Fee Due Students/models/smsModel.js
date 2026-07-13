const pool = require("../config/db");

// =====================================
// Send SMS (Save SMS History)
// =====================================

const sendSMS = async (student_ids) => {

    const sentSMS = [];

    for (const studentId of student_ids) {

        // =====================================
        // Get Student + Fee Due Details
        // =====================================

        const studentResult = await pool.query(

            `
            SELECT

                s.student_id,
                s.student_name,
                s.father_name,
                s.mobile,

                fd.term_id,
                fd.fee_due,

                t.term_name

            FROM fee_due_students s

            INNER JOIN fee_due_details fd
                ON s.student_id = fd.student_id

            INNER JOIN fee_due_terms t
                ON fd.term_id = t.term_id

            WHERE s.student_id = $1;
            `,

            [studentId]

        );

        if (studentResult.rows.length === 0) {
            continue;
        }

        const student = studentResult.rows[0];

        // =====================================
        // Check Payment Already Exists
        // =====================================

        let paymentResult = await pool.query(

            `
            SELECT *

            FROM fee_due_payments

            WHERE student_id = $1
            AND term_id = $2;
            `,

            [
                student.student_id,
                student.term_id
            ]

        );

        let payment;

        // =====================================
        // Create Payment Automatically
        // =====================================

        if (paymentResult.rows.length === 0) {

            const createPayment = await pool.query(

                `
                INSERT INTO fee_due_payments
                (
                    student_id,
                    term_id,
                    amount,
                    payment_status
                )

                VALUES($1,$2,$3,'Pending')

                RETURNING *;
                `,

                [
                    student.student_id,
                    student.term_id,
                    student.fee_due
                ]

            );

            payment = createPayment.rows[0];

        } else {

            payment = paymentResult.rows[0];

        }

        // =====================================
        // Generate Correct Payment Link
        // =====================================

        const paymentLink =
            `http://localhost:5000/api/payment/pay/${payment.payment_id}`;

        // =====================================
        // SMS Message
        // =====================================

        const message =

`Dear Parent,

Student : ${student.student_name}

Term : ${student.term_name}

Fee Due : ₹${student.fee_due}

Pay using:

${paymentLink}

Thank You.`;

        // =====================================
        // Save SMS History
        // =====================================

        const smsResult = await pool.query(

            `
            INSERT INTO fee_due_sms_history
            (
                student_id,
                mobile,
                message,
                payment_link
            )

            VALUES($1,$2,$3,$4)

            RETURNING *;
            `,

            [
                student.student_id,
                student.mobile,
                message,
                paymentLink
            ]

        );

        sentSMS.push(smsResult.rows[0]);

    }

    return sentSMS;

};

// =====================================
// Get SMS History
// =====================================

const getSMSHistory = async () => {

    const result = await pool.query(

        `
        SELECT

            sh.sms_id,

            s.student_name,

            s.father_name,

            sh.mobile,

            sh.message,

            sh.payment_link,

            sh.sent_at

        FROM fee_due_sms_history sh

        INNER JOIN fee_due_students s
            ON sh.student_id = s.student_id

        ORDER BY sh.sent_at DESC;
        `

    );

    return result.rows;

};

// =====================================
// Student SMS History
// =====================================

const getStudentSMSHistory = async (student_id) => {

    const result = await pool.query(

        `
        SELECT *

        FROM fee_due_sms_history

        WHERE student_id = $1

        ORDER BY sent_at DESC;
        `,

        [student_id]

    );

    return result.rows;

};

module.exports = {

    sendSMS,

    getSMSHistory,

    getStudentSMSHistory

};