const pool = require("../config/db");

// =======================================
// Dashboard Summary
// =======================================

const getDashboardSummary = async () => {

    const result = await pool.query(

        `
        SELECT

            (SELECT COUNT(*) FROM fee_due_students) AS total_students,

            (
                SELECT COALESCE(SUM(fee_due),0)
                FROM fee_due_details
            ) AS total_fee_due,

            (
                SELECT COALESCE(SUM(amount),0)
                FROM fee_due_payments
                WHERE payment_status = 'Paid'
            ) AS total_paid,

            (
                SELECT COALESCE(SUM(fee_due),0)
                FROM fee_due_details
            )
            -
            (
                SELECT COALESCE(SUM(amount),0)
                FROM fee_due_payments
                WHERE payment_status = 'Paid'
            ) AS total_pending,

            (
                SELECT COUNT(DISTINCT student_id)
                FROM fee_due_payments
                WHERE payment_status = 'Paid'
            ) AS paid_students,

            (
                SELECT COUNT(*)
                FROM fee_due_students
            )
            -
            (
                SELECT COUNT(DISTINCT student_id)
                FROM fee_due_payments
                WHERE payment_status = 'Paid'
            ) AS pending_students;
        `

    );

    return result.rows[0];

};


// =======================================
// Branch Dashboard
// =======================================

const getBranchDashboard = async () => {

    const result = await pool.query(

        `
        SELECT

            b.branch_id,

            b.branch_name,

            COUNT(DISTINCT s.student_id) AS total_students,

            COALESCE(SUM(fd.fee_due),0) AS total_fee_due,

            COALESCE(

                SUM(

                    CASE

                        WHEN fp.payment_status = 'Paid'

                        THEN fp.amount

                        ELSE 0

                    END

                ),0

            ) AS total_paid,

            COALESCE(SUM(fd.fee_due),0)

            -

            COALESCE(

                SUM(

                    CASE

                        WHEN fp.payment_status = 'Paid'

                        THEN fp.amount

                        ELSE 0

                    END

                ),0

            ) AS total_pending

        FROM fee_due_branches b

        LEFT JOIN fee_due_students s
            ON b.branch_id = s.branch_id

        LEFT JOIN fee_due_details fd
            ON s.student_id = fd.student_id

        LEFT JOIN fee_due_payments fp
            ON fp.student_id = s.student_id
            AND fp.term_id = fd.term_id

        GROUP BY

            b.branch_id,
            b.branch_name

        ORDER BY

            b.branch_name;
        `

    );

    return result.rows;

};


// =======================================
// Class Dashboard
// =======================================

const getClassDashboard = async () => {

    const result = await pool.query(

        `
        SELECT

            c.class_id,

            c.class_name,

            COUNT(DISTINCT s.student_id) AS total_students,

            COALESCE(SUM(fd.fee_due),0) AS total_fee_due,

            COALESCE(

                SUM(

                    CASE

                        WHEN fp.payment_status = 'Paid'

                        THEN fp.amount

                        ELSE 0

                    END

                ),0

            ) AS total_paid,

            COALESCE(SUM(fd.fee_due),0)

            -

            COALESCE(

                SUM(

                    CASE

                        WHEN fp.payment_status = 'Paid'

                        THEN fp.amount

                        ELSE 0

                    END

                ),0

            ) AS total_pending

        FROM fee_due_classes c

        LEFT JOIN fee_due_students s
            ON c.class_id = s.class_id

        LEFT JOIN fee_due_details fd
            ON s.student_id = fd.student_id

        LEFT JOIN fee_due_payments fp
            ON fp.student_id = s.student_id
            AND fp.term_id = fd.term_id

        GROUP BY

            c.class_id,
            c.class_name

        ORDER BY

            c.class_name;
        `

    );

    return result.rows;

};


// =======================================
// Recent Payments
// =======================================

const getRecentPayments = async () => {

    const result = await pool.query(

        `
        SELECT

            fp.payment_id,

            s.student_name,

            s.mobile,

            t.term_name,

            fp.amount,

            fp.payment_status,

            fp.transaction_id,

            fp.paid_at

        FROM fee_due_payments fp

        INNER JOIN fee_due_students s
            ON fp.student_id = s.student_id

        INNER JOIN fee_due_terms t
            ON fp.term_id = t.term_id

        ORDER BY

            fp.created_at DESC

        LIMIT 10;
        `

    );

    return result.rows;

};


module.exports = {

    getDashboardSummary,

    getBranchDashboard,

    getClassDashboard,

    getRecentPayments

};