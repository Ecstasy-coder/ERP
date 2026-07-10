const assignmentRepository = require("../repositories/assignmentRepository");
const { getPaginationParams } = require("../helpers/pagination");

const createAssignment = async (data) => {
  return await assignmentRepository.createAssignment(data);
};

const updateAssignment = async (id, data) => {
  return await assignmentRepository.updateAssignment(id, data);
};

const deleteAssignment = async (id) => {
  return await assignmentRepository.deleteAssignment(id);
};

const getAssignments = async (query = {}) => {
  const { page, limit, offset } = getPaginationParams(query);
  return await assignmentRepository.getAssignments({
    page,
    limit,
    offset,
    classId: query.class_id,
    search: query.search,
  });
};

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignments,
};
