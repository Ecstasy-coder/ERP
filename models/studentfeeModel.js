const pool = require('../config/db');

// GET all terms with payment details
const getStudentTerms = async(studentId) => {
    // First, find matching term_fee_details for this student (lenient matching)
    const findQuery = `
    SELECT
      t.term_fee_id,
      t.term_name,
      t.term_amount,
      t.due_date
    FROM term_fee_details t
    INNER JOIN branches b ON t.branch_id = b.branch_id
    INNER JOIN academic_years ay ON t.academic_year_id = ay.academic_year_id
    INNER JOIN study_classes sc ON t.class_id = sc.id
    INNER JOIN students s
      ON s.branch ILIKE ('%' || b.branch_code || '%')
      AND s.current_class ILIKE (sc.class_name || '%')
      AND s.current_academic_year ILIKE (ay.academic_year || '%')
    WHERE s.id = $1
    ORDER BY t.term_fee_id;
    `;

    let found = await pool.query(findQuery, [studentId]);

    // If no term fees matched the student's branch/class/year, fall back to returning all term fees
    if (found.rows.length === 0) {
        found = await pool.query(`SELECT term_fee_id, term_name, term_amount, due_date FROM term_fee_details ORDER BY term_fee_id`);
    }

    // Insert missing payment rows for each term so all term details are stored
    for (const t of found.rows) {
        const chk = await pool.query('SELECT 1 FROM student_term_payments WHERE term_fee_id = $1 AND student_id = $2', [t.term_fee_id, studentId]);
        if (chk.rows.length === 0) {
            await pool.query(
                `INSERT INTO student_term_payments (student_id, term_fee_id, term_name, term_amount, due_date, term_paid_amount, balance_amount, payment_details)
                     VALUES ($1,$2,$3,$4,$5,0,$4,'[]'::jsonb)`, [studentId, t.term_fee_id, t.term_name, t.term_amount, t.due_date]
            );
        }
    }

    // Return the combined view: list all term_fee_details and left-join any student payments by student_id
    const finalQuery = `
        SELECT
            t.term_fee_id,
            COALESCE(p.term_name, t.term_name) AS term_name,
            COALESCE(p.term_amount, t.term_amount) AS term_amount,
            COALESCE(p.due_date, t.due_date) AS due_date,
            COALESCE(p.term_paid_amount, 0) AS term_paid_amount,
            COALESCE(p.balance_amount, COALESCE(p.term_amount, t.term_amount)) AS balance_amount,
            COALESCE(p.payment_details, '[]') AS payment_details
        FROM term_fee_details t
        LEFT JOIN student_term_payments p
            ON t.term_fee_id = p.term_fee_id AND p.student_id = $1
        ORDER BY t.term_fee_id;
        `;

    const result = await pool.query(finalQuery, [studentId]);
    return result.rows;
};

// Auto receipt number
const generateReceiptNo = async() => {
    const result = await pool.query(`
    SELECT COALESCE(MAX((x->>'receipt_number')::INT), 1870) + 1 AS next_receipt
    FROM student_term_payments,
    jsonb_array_elements(payment_details) x
  `);

    return result.rows[0].next_receipt;
};

const updateTerm = async(termFeeId, data) => {
    const {
        term_amount,
        due_date,
        paid_date,
        paid_amount,
        pay_type,
        transaction_number,
        receipt_number
    } = data;

    const feeRow = await pool.query(
        `SELECT term_name, term_amount, due_date FROM term_fee_details WHERE term_fee_id = $1`, [termFeeId]
    );

    const termRow = feeRow.rows[0] || {};
    const paid = Number(paid_amount || 0);
    const termAmount = term_amount !== undefined && term_amount !== null ?
        Number(term_amount) :
        Number(termRow.term_amount || 0);
    const termName = data.term_name || termRow.term_name || null;
    const termDueDate = due_date || termRow.due_date || null;

    const existing = await pool.query(
        `SELECT * FROM student_term_payments WHERE term_fee_id = $1`, [termFeeId]
    );

    let paymentDetails = [];
    let totalPaid = paid;

    if (existing.rows.length > 0) {
        paymentDetails = existing.rows[0].payment_details || [];
        totalPaid += Number(existing.rows[0].term_paid_amount || 0);
    }

    if (paid > 0) {
        paymentDetails.push({
            paid_date,
            paid_amount: paid,
            pay_type,
            transaction_number,
            receipt_number
        });
    }

    const balance = termAmount - totalPaid;

    if (existing.rows.length > 0) {
        const result = await pool.query(
            `
      UPDATE student_term_payments
      SET
        term_name = $1,
        term_amount = $2,
        due_date = $3,
        term_paid_amount = $4,
        balance_amount = $5,
        payment_details = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE term_fee_id = $7
      RETURNING *;
      `, [
                termName,
                termAmount,
                termDueDate,
                totalPaid,
                balance,
                JSON.stringify(paymentDetails),
                termFeeId
            ]
        );

        return result.rows[0];
    } else {
        const result = await pool.query(
            `
      INSERT INTO student_term_payments (
        term_fee_id,
        term_name,
        term_amount,
        due_date,
        term_paid_amount,
        balance_amount,
        payment_details
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
      `, [
                termFeeId,
                termName,
                termAmount,
                termDueDate,
                totalPaid,
                balance,
                JSON.stringify(paymentDetails)
            ]
        );

        return result.rows[0];
    }
};


module.exports = {
    getStudentTerms,
    updateTerm,
    generateReceiptNo
};