const pool = require("../config/db");

const createAssignment = async (data) => {
  const query = `
    INSERT INTO class_assignments (
      branch_id,
      academic_year_id,
      class_id,
      section_id,
      title,
      description,
      assignment_date,
      due_date,
      created_by,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    data.branch_id,
    data.academic_year_id,
    data.class_id,
    data.section_id,
    data.title,
    data.description || null,
    data.assignment_date,
    data.due_date || null,
    data.created_by || null,
    true,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAssignments = async ({ branch_id, class_id, section_id, page = 1, limit = 10, offset = 0 } = {}) => {
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM class_assignments
    WHERE is_active = true
      AND branch_id = $1
      AND class_id = $2
      AND section_id = $3
  `;
  const countResult = await pool.query(countQuery, [branch_id, class_id, section_id]);

  const query = `
    SELECT *
    FROM class_assignments
    WHERE is_active = true
      AND branch_id = $1
      AND class_id = $2
      AND section_id = $3
    ORDER BY due_date ASC, id DESC
    LIMIT $4 OFFSET $5;
  `;

  const result = await pool.query(query, [branch_id, class_id, section_id, limit, offset]);
  return { items: result.rows, total: countResult.rows[0].total, page, limit };
};

const getAssignmentById = async (id) => {
  const result = await pool.query(`SELECT * FROM class_assignments WHERE id = $1 AND is_active = true;`, [id]);
  return result.rows[0];
};

const updateAssignment = async (id, data) => {
  const query = `
    UPDATE class_assignments
    SET title = COALESCE($1, title), description = COALESCE($2, description), assignment_date = COALESCE($3, assignment_date), due_date = COALESCE($4, due_date), updated_by = COALESCE($5, updated_by)
    WHERE id = $6 AND is_active = true
    RETURNING *;
  `;

  const values = [data.title || null, data.description !== undefined ? data.description : null, data.assignment_date || null, data.due_date !== undefined ? data.due_date : null, data.updated_by || null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteAssignment = async (id) => {
  const result = await pool.query(`UPDATE class_assignments SET is_active = false WHERE id = $1 AND is_active = true RETURNING *;`, [id]);
  return result.rows[0];
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
