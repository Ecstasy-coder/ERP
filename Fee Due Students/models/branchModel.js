const pool = require("../config/db");

// Create Branch
const createBranch = async (branch_name, branch_code) => {
    const result = await pool.query(
        `INSERT INTO fee_due_branches (branch_name, branch_code)
         VALUES ($1, $2)
         RETURNING *`,
        [branch_name, branch_code]
    );

    return result.rows[0];
};

// Get All Branches
const getAllBranches = async () => {
    const result = await pool.query(
        `SELECT *
         FROM fee_due_branches
         ORDER BY branch_name`
    );

    return result.rows;
};

// Get Branch By ID
const getBranchById = async (id) => {
    const result = await pool.query(
        `SELECT *
         FROM fee_due_branches
         WHERE branch_id=$1`,
        [id]
    );

    return result.rows[0];
};

// Update Branch
const updateBranch = async (id, branch_name, branch_code) => {
    const result = await pool.query(
        `UPDATE fee_due_branches
         SET branch_name=$1,
             branch_code=$2
         WHERE branch_id=$3
         RETURNING *`,
        [branch_name, branch_code, id]
    );

    return result.rows[0];
};

// Delete Branch
const deleteBranch = async (id) => {
    const result = await pool.query(
        `DELETE FROM fee_due_branches
         WHERE branch_id=$1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    deleteBranch
};