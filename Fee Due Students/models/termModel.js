const pool = require("../config/db");

// Create Term
const createTerm = async (term_name) => {
    const result = await pool.query(
        `INSERT INTO fee_due_terms (term_name)
         VALUES ($1)
         RETURNING *`,
        [term_name]
    );

    return result.rows[0];
};

// Get All Terms
const getAllTerms = async () => {
    const result = await pool.query(
        `SELECT *
         FROM fee_due_terms
         ORDER BY term_name`
    );

    return result.rows;
};

// Get Term By ID
const getTermById = async (id) => {
    const result = await pool.query(
        `SELECT *
         FROM fee_due_terms
         WHERE term_id = $1`,
        [id]
    );

    return result.rows[0];
};

// Update Term
const updateTerm = async (id, term_name) => {
    const result = await pool.query(
        `UPDATE fee_due_terms
         SET term_name = $1
         WHERE term_id = $2
         RETURNING *`,
        [term_name, id]
    );

    return result.rows[0];
};

// Delete Term
const deleteTerm = async (id) => {
    const result = await pool.query(
        `DELETE FROM fee_due_terms
         WHERE term_id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createTerm,
    getAllTerms,
    getTermById,
    updateTerm,
    deleteTerm
};