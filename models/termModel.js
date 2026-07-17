const pool = require('../config/db');

/**
 * Get all terms for a student (for summary table)
 */
const getAllTerms = async(studentId) => {
    const query = `
        SELECT 
            sft.id,
            sft.term_name,
            sft.term_amount,
            sft.due_date,
            sft.paid_amount,
            sft.balance_amount,
            sft.paid_date,
            sft.payment_type,
            sft.transaction_number,
            sft.receipt_number,
            sfd.student_id,
            sfd.subtotal_amount,
            s.full_name
        FROM student_fee_terms sft
        INNER JOIN student_fee_details sfd ON sft.student_fee_id = sfd.id
        INNER JOIN students s ON sfd.student_id = s.id
        WHERE sfd.student_id = $1
        ORDER BY sft.id, sft.term_name
    `;

    const result = await pool.query(query, [studentId]);

    if (result.rows.length === 0) {
        // Check if student exists
        const studentCheck = await pool.query('SELECT id, full_name FROM students WHERE id = $1', [studentId]);
        if (studentCheck.rows.length === 0) {
            throw new Error(`Student with ID ${studentId} does not exist`);
        }

        // Check if student has fee details
        const feeCheck = await pool.query('SELECT id FROM student_fee_details WHERE student_id = $1', [studentId]);
        if (feeCheck.rows.length === 0) {
            throw new Error(`No fee records found for student ID ${studentId}. Please add fee details first.`);
        }
    }

    return result.rows;
};

/**
 * Get a specific term for a student by term number/name
 */
const getTermByNumber = async(studentId, termNumber) => {
    // Convert number to term name (1 -> "Term 1", 2 -> "Term 2", etc.)
    const termName = isNaN(termNumber) ? termNumber : `Term ${termNumber}`;

    const query = `
        SELECT 
            sft.id,
            sft.term_name,
            sft.term_amount,
            sft.due_date,
            sft.paid_amount,
            sft.balance_amount,
            sft.paid_date,
            sft.payment_type,
            sft.transaction_number,
            sft.receipt_number,
            sfd.student_id,
            s.full_name
        FROM student_fee_terms sft
        INNER JOIN student_fee_details sfd ON sft.student_fee_id = sfd.id
        INNER JOIN students s ON sfd.student_id = s.id
        WHERE sfd.student_id = $1 AND sft.term_name = $2
    `;

    const result = await pool.query(query, [studentId, termName]);

    if (result.rows.length === 0) {
        // Provide diagnostic info
        const availableTerms = await pool.query(`
            SELECT DISTINCT sft.term_name
            FROM student_fee_terms sft
            INNER JOIN student_fee_details sfd ON sft.student_fee_id = sfd.id
            WHERE sfd.student_id = $1
        `, [studentId]);

        if (availableTerms.rows.length === 0) {
            throw new Error(`No terms found for student ID ${studentId}`);
        }

        const availableTermNames = availableTerms.rows.map(t => t.term_name);
        throw new Error(`Term "${termName}" not found for student ${studentId}. Available terms: ${availableTermNames.join(', ')}`);
    }

    return result.rows[0];
};

/**
 * Get a specific term for a student by term name
 */
const getTermByName = async(studentId, termName) => {
    const query = `
        SELECT 
            sft.id,
            sft.term_name,
            sft.term_amount,
            sft.due_date,
            sft.paid_amount,
            sft.balance_amount,
            sft.paid_date,
            sft.payment_type,
            sft.transaction_number,
            sft.receipt_number,
            sfd.student_id,
            s.full_name
        FROM student_fee_terms sft
        INNER JOIN student_fee_details sfd ON sft.student_fee_id = sfd.id
        INNER JOIN students s ON sfd.student_id = s.id
        WHERE sfd.student_id = $1 AND sft.term_name = $2
    `;

    const result = await pool.query(query, [studentId, termName]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

/**
 * Create missing fee terms for a student from the incoming update payload
 */
const ensureTermsForStudent = async(studentId, termPayloads) => {
    if (!Array.isArray(termPayloads) || termPayloads.length === 0) {
        return [];
    }

    const studentFeeDetailQuery = `
        SELECT id
        FROM student_fee_details
        WHERE student_id = $1
        ORDER BY id ASC
        LIMIT 1
    `;

    const studentFeeDetailResult = await pool.query(studentFeeDetailQuery, [studentId]);
    const studentFeeId = studentFeeDetailResult.rows[0].id;

    if (!studentFeeId) {
        throw new Error(`No fee records found for student ID ${studentId}. Please add fee details first.`);
    }

    const createdTerms = [];

    for (const term of termPayloads) {
        const termName = term.termName || term.term_name;
        if (!termName) continue;

        const existingTerm = await getTermByName(studentId, termName);
        if (existingTerm) continue;

        const termAmount = term.termAmount !== undefined ? Number(term.termAmount) : 0;
        const dueDate = term.dueDate || null;

        const insertQuery = `
            INSERT INTO student_fee_terms (
                student_fee_id,
                term_name,
                due_date,
                term_amount,
                paid_amount,
                balance_amount,
                paid_date,
                payment_type,
                transaction_number,
                receipt_number
            )
            VALUES ($1, $2, $3, $4, 0, $5, NULL, NULL, NULL, NULL)
            RETURNING *
        `;

        const insertResult = await pool.query(insertQuery, [studentFeeId, termName, dueDate, termAmount, termAmount]);
        createdTerms.push(insertResult.rows[0]);
    }

    return createdTerms;
};

/**
 * Update a term with payment information
 */
const updateTerm = async(studentId, termNumber, updateData) => {
    const {
        due_date,
        term_amount,
        paid_amount,
        balance_amount,
        paid_date,
        payment_type,
        transaction_number,
        receipt_number
    } = updateData;

    // Convert number to term name (1 -> "Term 1", 2 -> "Term 2", etc.)
    const termName = isNaN(termNumber) ? termNumber : `Term ${termNumber}`;

    const query = `
        UPDATE student_fee_terms
        SET 
            due_date = COALESCE($1, due_date),
            term_amount = COALESCE($2, term_amount),
            paid_amount = COALESCE($3, paid_amount),
            balance_amount = COALESCE($4, balance_amount),
            paid_date = $5,
            payment_type = COALESCE($6, payment_type),
            transaction_number = COALESCE($7, transaction_number),
            receipt_number = COALESCE($8, receipt_number),
            updated_at = CURRENT_TIMESTAMP
        FROM student_fee_details sfd
        WHERE student_fee_terms.student_fee_id = sfd.id
            AND sfd.student_id = $9
            AND student_fee_terms.term_name = $10
        RETURNING *
    `;

    const result = await pool.query(query, [
        due_date || null,
        term_amount || null,
        paid_amount || null,
        balance_amount || null,
        paid_date || null,
        payment_type || null,
        transaction_number || null,
        receipt_number || null,
        studentId,
        termName
    ]);

    if (result.rows.length === 0) {
        return null;
    }

    const updatedTerm = result.rows[0];

    // Get the student_fee_id from the updated term
    const getFeeIdQuery = `
        SELECT student_fee_id
        FROM student_fee_terms
        WHERE id = $1
    `;
    const feeIdResult = await pool.query(getFeeIdQuery, [updatedTerm.id]);
    const studentFeeId = feeIdResult.rows[0] ? feeIdResult.rows[0].student_fee_id : null;

    if (studentFeeId) {
        // Calculate total paid amount from all terms for this student_fee_id
        const totalPaidQuery = `
            SELECT COALESCE(SUM(paid_amount), 0) as total_paid
            FROM student_fee_terms
            WHERE student_fee_id = $1
        `;
        const totalPaidResult = await pool.query(totalPaidQuery, [studentFeeId]);
        const totalPaidAmount = Number(totalPaidResult.rows[0] ? totalPaidResult.rows[0].total_paid || 0 : 0);

        // Get subtotal from student_fee_details
        const subtotalQuery = `
            SELECT subtotal_amount
            FROM student_fee_details
            WHERE id = $1
        `;
        const subtotalResult = await pool.query(subtotalQuery, [studentFeeId]);
        const subtotalAmount = Number(subtotalResult.rows[0] ? subtotalResult.rows[0].subtotal_amount || 0 : 0);

        // Calculate new fee_balance
        const newFeeBalance = subtotalAmount - totalPaidAmount;

        // Update fee_paid and fee_balance in student_fee_details
        const updateFeeDetailsQuery = `
            UPDATE student_fee_details
            SET 
                fee_paid = $1,
                fee_balance = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `;
        await pool.query(updateFeeDetailsQuery, [totalPaidAmount, newFeeBalance, studentFeeId]);
    }

    return updatedTerm;
};

/**
 * Get all available payment types
 */
const getPaymentTypes = async() => {
    const query = `
        SELECT id, payment_type
        FROM payment_types
        WHERE is_active = TRUE
        ORDER BY payment_type
    `;

    const result = await pool.query(query);
    return result.rows;
};

/**
 * Get diagnostic info for a student
 */
const getDiagnosticInfo = async(studentId) => {
    try {
        // Check student exists
        const studentCheck = await pool.query('SELECT id, full_name FROM students WHERE id = $1', [studentId]);

        if (studentCheck.rows.length === 0) {
            return { error: `Student with ID ${studentId} does not exist` };
        }

        // Get fee details
        const feeDetails = await pool.query(`
            SELECT id, student_id, fee_type, fee_amount 
            FROM student_fee_details 
            WHERE student_id = $1
        `, [studentId]);

        if (feeDetails.rows.length === 0) {
            return {
                studentId,
                studentName: studentCheck.rows[0].full_name,
                error: 'No fee details found for this student'
            };
        }

        // Get terms for each fee detail
        const feeDetailIds = feeDetails.rows.map(f => f.id);
        const terms = await pool.query(`
            SELECT id, student_fee_id, term_name, term_amount 
            FROM student_fee_terms 
            WHERE student_fee_id = ANY($1::int[])
        `, [feeDetailIds]);

        return {
            studentId,
            studentName: studentCheck.rows[0].full_name,
            feeDetailsCount: feeDetails.rows.length,
            feeDetails: feeDetails.rows,
            termsCount: terms.rows.length,
            terms: terms.rows,
            message: terms.rows.length === 0 ? 'Fee details exist but no terms created yet' : 'Data found'
        };
    } catch (err) {
        return { error: err.message };
    }
};

/**
 * Get all available terms for a student
 */
const getAvailableTerms = async(studentId) => {
    try {
        const query = `
            SELECT DISTINCT sft.term_name
            FROM student_fee_terms sft
            INNER JOIN student_fee_details sfd ON sft.student_fee_id = sfd.id
            WHERE sfd.student_id = $1
            ORDER BY sft.term_name
        `;

        const result = await pool.query(query, [studentId]);
        return result.rows;
    } catch (err) {
        return [];
    }
};

/**
 * Update student_fee_details fee_paid and fee_balance from term payments
 */
const updateStudentFeeDetails = async(studentId, totalPaid, subtotal) => {
    try {
        const calculateFeeBalance = Number(subtotal) - Number(totalPaid);

        const query = `
            UPDATE student_fee_details
            SET 
                fee_paid = $1,
                fee_balance = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE student_id = $3
            RETURNING *
        `;

        const result = await pool.query(query, [totalPaid, calculateFeeBalance, studentId]);
        return result.rows || [];
    } catch (err) {
        console.error('Error updating student fee details:', err);
        return [];
    }
};

module.exports = {
    getAllTerms,
    getTermByNumber,
    getTermByName,
    ensureTermsForStudent,
    updateTerm,
    getPaymentTypes,
    getDiagnosticInfo,
    getAvailableTerms,
    updateStudentFeeDetails
};