const classAttendanceRepository = require("../repositories/classAttendanceRepository");
const messages = require("../constants/messages");

const getStudentsForAttendance = async (query = {}) => {
  return await classAttendanceRepository.getStudentsForAttendance({
    branch_id: query.branch_id,
    class_id: query.class_id,
    section_id: query.section_id,
  });
};

const markAttendance = async (data) => {
  const duplicate = await classAttendanceRepository.findDuplicateAttendance({
    branch_id: data.branch_id,
    class_id: data.class_id,
    section_id: data.section_id,
    student_id: data.student_id,
    attendance_date: data.attendance_date,
  });

  if (duplicate) {
    const error = new Error(messages.DUPLICATE_ATTENDANCE);
    error.statusCode = 409;
    throw error;
  }

  return await classAttendanceRepository.markAttendance(data);
};

const getAttendanceReport = async (query = {}) => {
  return await classAttendanceRepository.getAttendanceReport(query);
};

module.exports = {
  getStudentsForAttendance,
  markAttendance,
  getAttendanceReport,
};
