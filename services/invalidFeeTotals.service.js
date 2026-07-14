const pool = require("../config/db");

// ─────────────────────────────────────────────
// Get all invalid fee totals (with filters)
// ─────────────────────────────────────────────
const getAllInvalidFeeTotals = async ({ student_id, status, page = 1, limit = 20 }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (student_id) {
    conditions.push(`student_id = $${idx++}`);
    values.push(student_id);
  }
  if (status) {
    conditions.push(`status = $${idx++}`);
    values.push(status.toUpperCase());
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT * FROM invalid_fee_totals
    ${where}
    ORDER BY diff DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  values.push(limit, offset);

  const countQuery = `SELECT COUNT(*) FROM invalid_fee_totals ${where}`;
  const sumQuery = `
      SELECT
          COALESCE(SUM(reported),0) AS total_reported,
          COALESCE(SUM(calculated),0) AS total_calculated,
          COALESCE(SUM(diff),0) AS total_difference
      FROM invalid_fee_totals
      ${where}
    `;

  const [dataResult, countResult, sumResult] = await Promise.all([
    pool.query(dataQuery, values),
    pool.query(countQuery, values.slice(0, idx - 3)),
    pool.query(sumQuery,   values.slice(0, idx - 3)),
  ]);

    return {
    total_students: Number(countResult.rows[0].count),
    total_reported: Number(sumResult.rows[0].total_reported),
    total_calculated: Number(sumResult.rows[0].total_calculated),
    total_difference: Number(sumResult.rows[0].total_difference),
    page: Number(page),
    limit: Number(limit),
    data: dataResult.rows,
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






