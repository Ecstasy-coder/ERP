const classAssignmentRepository = require("../repositories/classAssignmentRepository");
const { getPaginationParams } = require("../helpers/pagination");

const createAssignment = async (data) => {
  return await classAssignmentRepository.createAssignment(data);
};

const getAssignments = async (query = {}) => {
  const { page, limit, offset } = getPaginationParams(query);
  return await classAssignmentRepository.getAssignments({
    branch_id: query.branch_id,
    class_id: query.class_id,
    section_id: query.section_id,
    page,
    limit,
    offset,
  });
};

const getAssignmentById = async (id) => {
  return await classAssignmentRepository.getAssignmentById(id);
};

const updateAssignment = async (id, data) => {
  return await classAssignmentRepository.updateAssignment(id, data);
};

const deleteAssignment = async (id) => {
  return await classAssignmentRepository.deleteAssignment(id);
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
