const pool = require("../config/db");

const assignTeacher = async (data) => {
  const query = `
    INSERT INTO class_teachers (class_id, teacher_id, academic_year, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [data.class_id, data.teacher_id, data.academic_year, data.status !== undefined ? data.status : true];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateTeacherAssignment = async (id, data) => {
  const query = `
    UPDATE class_teachers
    SET academic_year = COALESCE($1, academic_year), status = COALESCE($2, status)
    WHERE teacher_class_id = $3
    RETURNING *;
  `;

  const values = [data.academic_year || null, data.status !== undefined ? data.status : null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const removeTeacherAssignment = async (id) => {
  const result = await pool.query(
    `DELETE FROM class_teachers WHERE teacher_class_id = $1 RETURNING *;`,
    [id]
  );
  return result.rows[0];
};

const getTeachersByClass = async (classId) => {
  const result = await pool.query(
    `SELECT * FROM class_teachers WHERE class_id = $1 ORDER BY teacher_class_id ASC;`,
    [classId]
  );
  return result.rows;
};

const findDuplicateAssignment = async (classId, teacherId, academicYear) => {
  const result = await pool.query(
    `SELECT * FROM class_teachers WHERE class_id = $1 AND teacher_id = $2 AND academic_year = $3 AND status = true;`,
    [classId, teacherId, academicYear]
  );
  return result.rows[0];
};

module.exports = {
  assignTeacher,
  updateTeacherAssignment,
  removeTeacherAssignment,
  getTeachersByClass,
  findDuplicateAssignment,
};
