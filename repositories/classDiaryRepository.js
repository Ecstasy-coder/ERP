const pool = require("../config/db");

const createDiary = async (data) => {
  let sectionId = data.section_id || null;

  if (!sectionId) {
    const fallbackSection = await pool.query(`SELECT id FROM sections ORDER BY id LIMIT 1;`);
    sectionId = fallbackSection.rows[0]?.id || null;
  }

  if (!sectionId) {
    const createdSection = await pool.query(`
      INSERT INTO sections (section_name, is_active)
      VALUES ('Default', true)
      RETURNING id;
    `);
    sectionId = createdSection.rows[0].id;
  }

  const query = `
    INSERT INTO class_diary_entries (
      branch_id,
      academic_year_id,
      class_id,
      section_id,
      diary_date,
      subject_id,
      message,
      created_by,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    data.branch_id,
    data.academic_year_id,
    data.class_id,
    sectionId,
    data.diary_date,
    data.subject_id,
    data.message,
    data.created_by || null,
    true,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getDiaries = async ({ branch_id, class_id, section_id, page = 1, limit = 10, offset = 0 } = {}) => {
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM class_diary_entries
    WHERE is_active = true
      AND branch_id = $1
      AND class_id = $2
      AND section_id = $3
  `;
  const countResult = await pool.query(countQuery, [branch_id, class_id, section_id]);

  const query = `
    SELECT cde.*, s.subject_title AS subject_name
    FROM class_diary_entries cde
    LEFT JOIN subjects s ON s.id = cde.subject_id
    WHERE cde.is_active = true
      AND cde.branch_id = $1
      AND cde.class_id = $2
      AND cde.section_id = $3
    ORDER BY cde.diary_date DESC, cde.id DESC
    LIMIT $4 OFFSET $5;
  `;

  const result = await pool.query(query, [branch_id, class_id, section_id, limit, offset]);
  return { items: result.rows, total: countResult.rows[0].total, page, limit };
};

const getDiaryById = async (id) => {
  const result = await pool.query(`SELECT * FROM class_diary_entries WHERE id = $1 AND is_active = true;`, [id]);
  return result.rows[0];
};

const updateDiary = async (id, data) => {
  const query = `
    UPDATE class_diary_entries
    SET diary_date = COALESCE($1, diary_date), subject_id = COALESCE($2, subject_id), message = COALESCE($3, message), updated_by = COALESCE($4, updated_by)
    WHERE id = $5 AND is_active = true
    RETURNING *;
  `;

  const values = [data.diary_date || null, data.subject_id !== undefined ? data.subject_id : null, data.message !== undefined ? data.message : null, data.updated_by || null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteDiary = async (id) => {
  const result = await pool.query(`UPDATE class_diary_entries SET is_active = false WHERE id = $1 AND is_active = true RETURNING *;`, [id]);
  return result.rows[0];
};

module.exports = {
  createDiary,
  getDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary,
};
