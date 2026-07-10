const pool = require("../config/db");

const createAssignment = async (data) => {
  const query = `
    INSERT INTO class_assignments (class_id, title, description, due_date, attachment, created_by, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [data.class_id, data.title, data.description || null, data.due_date || null, data.attachment || null, data.created_by || null, true];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateAssignment = async (id, data) => {
  const query = `
    UPDATE class_assignments
    SET title = COALESCE($1, title), description = COALESCE($2, description), due_date = COALESCE($3, due_date), attachment = COALESCE($4, attachment)
    WHERE assignment_id = $5 AND status = true
    RETURNING *;
  `;

  const values = [data.title || null, data.description !== undefined ? data.description : null, data.due_date || null, data.attachment !== undefined ? data.attachment : null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteAssignment = async (id) => {
  const result = await pool.query(
    `UPDATE class_assignments SET status = false WHERE assignment_id = $1 AND status = true RETURNING *;`,
    [id]
  );
  return result.rows[0];
};

const getAssignments = async ({ page = 1, limit = 10, offset = 0, classId = null, search = "" } = {}) => {
  const searchPattern = `%${search}%`;
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM class_assignments
    WHERE status = true
      AND ($1::int IS NULL OR class_id = $1)
      AND ($2::text IS NULL OR title ILIKE $2 OR description ILIKE $2)
  `;

  const countResult = await pool.query(countQuery, [classId || null, search ? searchPattern : null]);

  const query = `
    SELECT *
    FROM class_assignments
    WHERE status = true
      AND ($1::int IS NULL OR class_id = $1)
      AND ($2::text IS NULL OR title ILIKE $2 OR description ILIKE $2)
    ORDER BY due_date ASC, assignment_id DESC
    LIMIT $3 OFFSET $4;
  `;

  const result = await pool.query(query, [classId || null, search ? searchPattern : null, limit, offset]);
  return { items: result.rows, total: countResult.rows[0].total, page, limit };
};

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignments,
};
