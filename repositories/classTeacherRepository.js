const pool = require("../config/db");
const queries = require("../queries/classTeacherQueries");

const createAssignment = async (data) => {
  const values = [
    data.branch_id,
    data.academic_year_id,
    data.class_id,
    data.section_id,
    data.teacher_id,
    data.subject_id,
    data.is_class_teacher !== undefined ? data.is_class_teacher : false,
    data.remarks || null,
    data.is_active !== undefined ? data.is_active : true,
    data.created_by || null,
  ];

  const result = await pool.query(queries.createAssignment, values);
  return result.rows[0];
};

const getAllAssignments = async ({ search = "", filters = {}, page = 1, limit = 10, offset = 0 } = {}) => {
  let whereClauses = ["cta.is_active = true"];
  const values = [];

  if (search) {
    whereClauses.push(`(
      t.teacher_name ILIKE $${values.length + 1}
      OR s.subject_name ILIKE $${values.length + 1}
      OR sc.class_name ILIKE $${values.length + 1}
      OR sec.section_name ILIKE $${values.length + 1}
    )`);
    values.push(`%${search}%`);
  }

  if (filters.branch_id) {
    whereClauses.push(`cta.branch_id = $${values.length + 1}`);
    values.push(filters.branch_id);
  }

  if (filters.academic_year_id) {
    whereClauses.push(`cta.academic_year_id = $${values.length + 1}`);
    values.push(filters.academic_year_id);
  }

  if (filters.class_id) {
    whereClauses.push(`cta.class_id = $${values.length + 1}`);
    values.push(filters.class_id);
  }

  if (filters.section_id) {
    whereClauses.push(`cta.section_id = $${values.length + 1}`);
    values.push(filters.section_id);
  }

  if (filters.teacher_id) {
    whereClauses.push(`cta.teacher_id = $${values.length + 1}`);
    values.push(filters.teacher_id);
  }

  const countQuery = `${queries.countAssignments} AND ${whereClauses.join(" AND ")};`;
  const countResult = await pool.query(countQuery, values);

  const query = `${queries.getAllAssignments} WHERE ${whereClauses.join(" AND ")} ORDER BY cta.id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2};`;
  const result = await pool.query(query, [...values, limit, offset]);

  return {
    items: result.rows,
    total: countResult.rows[0].total,
    page,
    limit,
  };
};

const getAssignmentById = async (id) => {
  const result = await pool.query(queries.getAssignmentById, [id]);
  return result.rows[0];
};

const updateAssignment = async (id, data, updatedBy = null) => {
  const values = [
    data.branch_id !== undefined ? data.branch_id : null,
    data.academic_year_id !== undefined ? data.academic_year_id : null,
    data.class_id !== undefined ? data.class_id : null,
    data.section_id !== undefined ? data.section_id : null,
    data.teacher_id !== undefined ? data.teacher_id : null,
    data.subject_id !== undefined ? data.subject_id : null,
    data.is_class_teacher !== undefined ? data.is_class_teacher : null,
    data.remarks !== undefined ? data.remarks : null,
    updatedBy,
    id,
  ];

  const result = await pool.query(queries.updateAssignment, values);
  return result.rows[0];
};

const softDeleteAssignment = async (id, updatedBy = null) => {
  const result = await pool.query(queries.softDeleteAssignment, [updatedBy, id]);
  return result.rows[0];
};

const findExistingAssignment = async (data) => {
  const result = await pool.query(queries.findExistingAssignment, [
    data.branch_id,
    data.academic_year_id,
    data.class_id,
    data.section_id,
    data.teacher_id,
    data.subject_id,
  ]);
  return result.rows[0];
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  softDeleteAssignment,
  findExistingAssignment,
};
