const pool = require("../config/db");

const createClass = async (data) => {
  const query = `
    INSERT INTO study_classes (class_name, is_active, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *;
  `;

  const values = [data.class_name, data.is_active !== undefined ? data.is_active : true];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllClasses = async ({ search = "", page = 1, limit = 10, offset = 0 } = {}) => {
  const searchPattern = `%${search}%`;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM study_classes
    WHERE is_active = true
      AND ($1::text IS NULL OR class_name ILIKE $1)
  `;

  const countResult = await pool.query(countQuery, [search ? searchPattern : null]);

  const query = `
    SELECT *
    FROM study_classes
    WHERE is_active = true
      AND ($1::text IS NULL OR class_name ILIKE $1)
    ORDER BY id ASC
    LIMIT $2 OFFSET $3;
  `;

  const result = await pool.query(query, [search ? searchPattern : null, limit, offset]);

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page,
    limit,
  };
};

const getClassById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM study_classes WHERE id = $1 AND is_active = true`,
    [id]
  );

  return result.rows[0];
};

const findByClassName = async (className) => {
  const result = await pool.query(`SELECT * FROM study_classes WHERE class_name = $1 AND is_active = true`, [className]);
  return result.rows[0];
};

const updateClass = async (id, data) => {
  const query = `
    UPDATE study_classes
    SET
      class_name = COALESCE($1, class_name),
      is_active = COALESCE($2, is_active),
      updated_at = NOW()
    WHERE id = $3 AND is_active = true
    RETURNING *;
  `;

  const values = [
    data.class_name || null,
    data.is_active !== undefined ? data.is_active : null,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteClass = async (id) => {
  const result = await pool.query(
    `UPDATE study_classes SET is_active = false, updated_at = NOW() WHERE id = $1 AND is_active = true RETURNING *;`,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  findByClassName,
  updateClass,
  deleteClass,
};