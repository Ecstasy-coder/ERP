const timetableRepository = require("../repositories/timetableRepository");
const messages = require("../constants/messages");

const createTimetable = async (data) => {
  const overlap = await timetableRepository.findOverlap(data.class_id, data.day_name, data.start_time, data.end_time, data.period_no);
  if (overlap) {
    const error = new Error(messages.OVERLAPPING_TIMETABLE);
    error.statusCode = 409;
    throw error;
  }

  return await timetableRepository.createTimetable(data);
};

const updateTimetable = async (id, data) => {
  const overlap = await timetableRepository.findOverlap(data.class_id, data.day_name, data.start_time, data.end_time, data.period_no, id);
  if (overlap) {
    const error = new Error(messages.OVERLAPPING_TIMETABLE);
    error.statusCode = 409;
    throw error;
  }

  return await timetableRepository.updateTimetable(id, data);
};

const deleteTimetable = async (id) => {
  return await timetableRepository.deleteTimetable(id);
};

const getWeeklyTimetable = async (classId) => {
  return await timetableRepository.getWeeklyTimetable(classId);
};

module.exports = {
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getWeeklyTimetable,
};
