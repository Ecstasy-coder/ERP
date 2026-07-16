const pool = require("../config/db");

const getBranches = async () => {
  const result = await pool.query(
    `SELECT branch_id AS id, branch_name FROM branches WHERE status = true ORDER BY branch_name ASC;`
  );
  return result.rows;
};

const getSections = async () => {
  const result = await pool.query(
    `SELECT id, section_name FROM sections WHERE is_active = true ORDER BY section_name ASC;`
  );
  return result.rows;
};

module.exports = {
  getBranches,
  getSections,
};
