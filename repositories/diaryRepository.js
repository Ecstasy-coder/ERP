const pool = require("../config/db");

const createDiary = async (data) => {
  const query = `
    INSERT INTO class_diary (class_id, title, description, diary_date, created_by, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [data.class_id, data.title, data.description || null, data.diary_date, data.created_by || null, true];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const editDiary = async (id, data) => {
  const query = `
    UPDATE class_diary
    SET title = COALESCE($1, title), description = COALESCE($2, description), diary_date = COALESCE($3, diary_date)
    WHERE diary_id = $4 AND status = true
    RETURNING *;
  `;

  const values = [data.title || null, data.description !== undefined ? data.description : null, data.diary_date || null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteDiary = async (id) => {
  const result = await pool.query(
    `UPDATE class_diary SET status = false WHERE diary_id = $1 AND status = true RETURNING *;`,
    [id]
  );
  return result.rows[0];
};

const getDiaries = async ({ page = 1, limit = 10, offset = 0, date = null } = {}) => {
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM class_diary
    WHERE status = true
      AND ($1::text IS NULL OR diary_date = $1)
  `;

  const countResult = await pool.query(countQuery, [date || null]);

  const query = `
    SELECT *
    FROM class_diary
    WHERE status = true
      AND ($1::text IS NULL OR diary_date = $1)
    ORDER BY diary_date DESC, diary_id DESC
    LIMIT $2 OFFSET $3;
  `;

  const result = await pool.query(query, [date || null, limit, offset]);
  return { items: result.rows, total: countResult.rows[0].total, page, limit };
};

module.exports = {
  createDiary,
  editDiary,
  deleteDiary,
  getDiaries,
};
