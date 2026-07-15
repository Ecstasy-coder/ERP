const pool = require("../config/db");

// =========================
// GET ALL BRANCHES
// =========================
const getAllBranches = async () => {

    const query = `
        SELECT
            branch_id,
            branch_code,
            branch_name,
            branch_address,
            contact_number,
            email,
            status,
            created_at,
            updated_at
        FROM branches
        ORDER BY branch_id;
    `;

    const result = await pool.query(query);

    return result.rows;
};

// =========================
// GET BRANCH BY ID
// =========================
const getBranchById = async (id) => {

    const query = `
        SELECT
            branch_id,
            branch_code,
            branch_name,
            branch_address,
            contact_number,
            email,
            status,
            created_at,
            updated_at
        FROM branches
        WHERE branch_id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

// =========================
// CREATE BRANCH
// =========================
const createBranch = async (branch) => {

    console.log("========== CREATE ==========");
    console.log("Received Branch:", branch);

    const query = `
        INSERT INTO branches
        (
            branch_code,
            branch_name,
            branch_address,
            contact_number,
            email,
            status,
            created_at,
            updated_at
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        RETURNING *;
    `;

    const values = [
        branch.branch_code,
        branch.branch_name,
        branch.branch_address,
        branch.contact_number,
        branch.email,
        branch.status ?? true
    ];

    console.log("SQL:");
    console.log(query);

    console.log("VALUES:");
    console.log(values);

    const result = await pool.query(query, values);

    console.log("Inserted Row:");
    console.log(result.rows[0]);

    return result.rows[0];
};

// =========================
// UPDATE BRANCH
// =========================
const updateBranch = async (id, branch) => {

    console.log("========== UPDATE ==========");
    console.log("ID:", id);
    console.log("Received Branch:", branch);

    const query = `
        UPDATE branches
        SET
            branch_code=$1,
            branch_name=$2,
            branch_address=$3,
            contact_number=$4,
            email=$5,
            status=$6,
            updated_at=CURRENT_TIMESTAMP
        WHERE branch_id=$7
        RETURNING *;
    `;

    const values = [
        branch.branch_code,
        branch.branch_name,
        branch.branch_address,
        branch.contact_number,
        branch.email,
        branch.status ?? true,
        id
    ];

    console.log("SQL:");
    console.log(query);

    console.log("VALUES:");
    console.log(values);

    const result = await pool.query(query, values);

    console.log("Updated Row:");
    console.log(result.rows[0]);

    return result.rows[0];
};

// =========================
// DELETE BRANCH
// =========================
const deleteBranch = async (id) => {

    console.log("========== DELETE ==========");
    console.log("ID:", id);

    const query = `
        DELETE FROM branches
        WHERE branch_id=$1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    console.log("Deleted Row:");
    console.log(result.rows[0]);

    return result.rows[0];
};

module.exports = {
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch
};