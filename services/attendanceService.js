const attendanceRepository = require("../repositories/attendanceRepository");
const messages = require("../constants/messages");

const markAttendance = async (data) => {
  const duplicate = await attendanceRepository.findDuplicateAttendance(data.student_id, data.class_id, data.attendance_date);
  if (duplicate) {
    const error = new Error(messages.DUPLICATE_ATTENDANCE);
    error.statusCode = 409;
    throw error;
  }

  return await attendanceRepository.markAttendance(data);
};

const bulkAttendance = async (items) => {
  const results = [];
  for (const item of items) {
    const created = await markAttendance(item);
    results.push(created);
  }
  return results;
};

const updateAttendance = async (id, data) => {
  return await attendanceRepository.updateAttendance(id, data);
};

const getTodayAttendance = async () => {
  return await attendanceRepository.getTodayAttendance();
};

const getMonthlyAttendance = async (month, year) => {
  return await attendanceRepository.getMonthlyAttendance(month, year);
};

const getAttendanceReport = async (query) => {
  return await attendanceRepository.getAttendanceReport(query);
};

module.exports = {
  markAttendance,
  bulkAttendance,
  updateAttendance,
  getTodayAttendance,
  getMonthlyAttendance,
  getAttendanceReport,
};
