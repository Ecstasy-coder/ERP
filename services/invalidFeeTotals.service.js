const pool = require("../config/db");

// ─────────────────────────────────────────────
// Get all invalid fee totals (with filters)
// ─────────────────────────────────────────────
const getAllInvalidFeeTotals = async ({ student_id, current_class, page = 1, limit = 20 }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (student_id) {
    conditions.push(`student_id = $${idx++}`);
    values.push(student_id);
  }
  if (current_class) {
    conditions.push(`current_class ILIKE $${idx++}`);
    values.push(`%${current_class}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT * FROM invalid_fee_totals
    ${where}
    ORDER BY total_invalid_amount DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  values.push(limit, offset);

  const countQuery = `SELECT COUNT(*) FROM invalid_fee_totals ${where}`;
  const sumQuery   = `SELECT SUM(total_invalid_amount) AS grand_total FROM invalid_fee_totals ${where}`;

  const [dataResult, countResult, sumResult] = await Promise.all([
    pool.query(dataQuery, values),
    pool.query(countQuery, values.slice(0, idx - 3)),
    pool.query(sumQuery,   values.slice(0, idx - 3)),
  ]);

  return {
    total_students : parseInt(countResult.rows[0].count),
    grand_total    : parseFloat(sumResult.rows[0].grand_total || 0),
    page           : parseInt(page),
    limit          : parseInt(limit),
    data           : dataResult.rows,
  };
};

// ─────────────────────────────────────────────
// Get total summary for a single student
// ─────────────────────────────────────────────
const getStudentInvalidTotal = async (student_id) => {
  const result = await pool.query(
    "SELECT * FROM invalid_fee_totals WHERE student_id = $1",
    [student_id]
  );
  return result.rows[0] || null;
};

module.exports = {
  getAllInvalidFeeTotals,
  getStudentInvalidTotal,
};






