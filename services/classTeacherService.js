const classTeacherRepository = require("../repositories/classTeacherRepository");
const messages = require("../constants/messages");
const { getPaginationParams } = require("../helpers/pagination");

const createAssignment = async (data, user = null) => {
  const duplicate = await classTeacherRepository.findExistingAssignment(data);
  if (duplicate) {
    const error = new Error(messages.DUPLICATE_ASSIGNMENT);
    error.statusCode = 409;
    throw error;
  }

  return await classTeacherRepository.createAssignment({
    ...data,
    created_by: user?.id || null,
    updated_by: user?.id || null,
  });
};

const getAllAssignments = async (query = {}, user = null) => {
  const { page, limit, offset } = getPaginationParams(query);
  const filters = {
    branch_id: query.branch_id,
    academic_year_id: query.academic_year_id,
    class_id: query.class_id,
    section_id: query.section_id,
    teacher_id: query.teacher_id,
  };

  if (user?.role === "teacher") {
    filters.teacher_id = user.id;
  }

  return await classTeacherRepository.getAllAssignments({
    search: query.search,
    filters,
    page,
    limit,
    offset,
  });
};

const getAssignmentById = async (id) => {
  const assignment = await classTeacherRepository.getAssignmentById(id);
  if (!assignment) {
    const error = new Error(messages.CLASS_NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }

  return assignment;
};

const updateAssignment = async (id, data, user = null) => {
  const existing = await classTeacherRepository.getAssignmentById(id);
  if (!existing) {
    const error = new Error(messages.CLASS_NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }

  if (data.teacher_id || data.subject_id || data.class_id || data.section_id || data.branch_id || data.academic_year_id) {
    const duplicate = await classTeacherRepository.findExistingAssignment({
      branch_id: data.branch_id !== undefined ? data.branch_id : existing.branch_id,
      academic_year_id: data.academic_year_id !== undefined ? data.academic_year_id : existing.academic_year_id,
      class_id: data.class_id !== undefined ? data.class_id : existing.class_id,
      section_id: data.section_id !== undefined ? data.section_id : existing.section_id,
      teacher_id: data.teacher_id !== undefined ? data.teacher_id : existing.teacher_id,
      subject_id: data.subject_id !== undefined ? data.subject_id : existing.subject_id,
    });

    if (duplicate && duplicate.id !== Number(id)) {
      const error = new Error(messages.DUPLICATE_ASSIGNMENT);
      error.statusCode = 409;
      throw error;
    }
  }

  return await classTeacherRepository.updateAssignment(id, data, user?.id || null);
};

const softDeleteAssignment = async (id, user = null) => {
  const existing = await classTeacherRepository.getAssignmentById(id);
  if (!existing) {
    const error = new Error(messages.CLASS_NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }

  return await classTeacherRepository.softDeleteAssignment(id, user?.id || null);
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  softDeleteAssignment,
};
