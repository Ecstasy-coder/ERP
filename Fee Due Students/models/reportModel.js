const pool = require("../config/db");

// =======================================
// Fee Due Report
// =======================================

const getFeeDueReport = async () => {

    const result = await pool.query(

        `
        SELECT

            fd.fee_due_id,

            s.student_id,
            s.student_name,
            s.father_name,
            s.mobile,

            b.branch_name,

            c.class_name,

            t.term_name,

            fd.fee_due,

            COALESCE(fp.payment_status,'Pending') AS payment_status,

            fp.paid_at

        FROM fee_due_details fd

        INNER JOIN fee_due_students s
            ON fd.student_id = s.student_id

        INNER JOIN fee_due_branches b
            ON s.branch_id = b.branch_id

        INNER JOIN fee_due_classes c
            ON s.class_id = c.class_id

        INNER JOIN fee_due_terms t
            ON fd.term_id = t.term_id

        LEFT JOIN fee_due_payments fp
            ON fp.student_id = fd.student_id
            AND fp.term_id = fd.term_id

        ORDER BY

            b.branch_name,
            c.class_name,
            s.student_name;
        `

    );

    return result.rows;

};


// =======================================
// Payment Report
// =======================================

const getPaymentReport = async () => {

    const result = await pool.query(

        `
        SELECT

            fp.payment_id,

            s.student_name,

            s.mobile,

            b.branch_name,

            c.class_name,

            t.term_name,

            fp.amount,

            fp.payment_status,

            fp.transaction_id,

            fp.payment_link,

            fp.created_at,

            fp.paid_at

        FROM fee_due_payments fp

        INNER JOIN fee_due_students s
            ON fp.student_id = s.student_id

        INNER JOIN fee_due_branches b
            ON s.branch_id = b.branch_id

        INNER JOIN fee_due_classes c
            ON s.class_id = c.class_id

        INNER JOIN fee_due_terms t
            ON fp.term_id = t.term_id

        ORDER BY

            fp.created_at DESC;
        `

    );

    return result.rows;

};


// =======================================
// Student Report
// =======================================

const getStudentReport = async (student_id) => {

    const result = await pool.query(

        `
        SELECT

            s.student_id,

            s.student_name,

            s.father_name,

            s.mobile,

            b.branch_name,

            c.class_name,

            t.term_name,

            fd.fee_due,

            COALESCE(fp.amount,0) AS amount,

            COALESCE(fp.payment_status,'Pending') AS payment_status,

            fp.transaction_id,

            fp.paid_at

        FROM fee_due_students s

        INNER JOIN fee_due_branches b
            ON s.branch_id = b.branch_id

        INNER JOIN fee_due_classes c
            ON s.class_id = c.class_id

        INNER JOIN fee_due_details fd
            ON s.student_id = fd.student_id

        INNER JOIN fee_due_terms t
            ON fd.term_id = t.term_id

        LEFT JOIN fee_due_payments fp
            ON fp.student_id = s.student_id
            AND fp.term_id = fd.term_id

        WHERE s.student_id = $1;
        `,

        [student_id]

    );

    return result.rows;

};


// =======================================
// Branch Report
// =======================================

const getBranchReport = async (branch_id) => {

    const result = await pool.query(

        `
        SELECT

            s.student_name,

            s.mobile,

            c.class_name,

            t.term_name,

            fd.fee_due,

            COALESCE(fp.payment_status,'Pending') AS payment_status,

            fp.paid_at

        FROM fee_due_students s

        INNER JOIN fee_due_classes c
            ON s.class_id = c.class_id

        INNER JOIN fee_due_details fd
            ON s.student_id = fd.student_id

        INNER JOIN fee_due_terms t
            ON fd.term_id = t.term_id

        LEFT JOIN fee_due_payments fp
            ON fp.student_id = s.student_id
            AND fp.term_id = fd.term_id

        WHERE s.branch_id = $1

        ORDER BY

            c.class_name,
            s.student_name;
        `,

        [branch_id]

    );

    return result.rows;

};


module.exports = {

    getFeeDueReport,

    getPaymentReport,

    getStudentReport,

    getBranchReport

};