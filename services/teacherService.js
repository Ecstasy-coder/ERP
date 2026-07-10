const teacherRepository = require("../repositories/teacherRepository");
const messages = require("../constants/messages");

const assignTeacher = async (data) => {
  const duplicate = await teacherRepository.findDuplicateAssignment(data.class_id, data.teacher_id, data.academic_year);
  if (duplicate) {
    const error = new Error(messages.DUPLICATE_ASSIGNMENT);
    error.statusCode = 409;
    throw error;
  }

  return await teacherRepository.assignTeacher(data);
};

const updateTeacherAssignment = async (id, data) => {
  return await teacherRepository.updateTeacherAssignment(id, data);
};

const removeTeacherAssignment = async (id) => {
  return await teacherRepository.removeTeacherAssignment(id);
};

const getTeachersByClass = async (classId) => {
  return await teacherRepository.getTeachersByClass(classId);
};

module.exports = {
  assignTeacher,
  updateTeacherAssignment,
  removeTeacherAssignment,
  getTeachersByClass,
};
