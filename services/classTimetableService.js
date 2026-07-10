const classTimetableRepository = require("../repositories/classTimetableRepository");

const createTimetable = async (data) => {
  const overlap = await classTimetableRepository.findOverlap({
    branch_id: data.branch_id,
    class_id: data.class_id,
    section_id: data.section_id,
    day_name: data.day_name,
    start_time: data.start_time,
    end_time: data.end_time,
    period_no: data.period_no,
  });

  if (overlap) {
    const error = new Error("One teacher cannot have overlapping timetable periods");
    error.statusCode = 409;
    throw error;
  }

  return await classTimetableRepository.createTimetable(data);
};

const getWeeklyTimetable = async (query = {}) => {
  return await classTimetableRepository.getWeeklyTimetable({
    branch_id: query.branch_id,
    class_id: query.class_id,
    section_id: query.section_id,
  });
};

const getTimetableById = async (id) => {
  return await classTimetableRepository.getTimetableById(id);
};

const updateTimetable = async (id, data) => {
  const overlap = await classTimetableRepository.findOverlap({
    branch_id: data.branch_id,
    class_id: data.class_id,
    section_id: data.section_id,
    day_name: data.day_name,
    start_time: data.start_time,
    end_time: data.end_time,
    period_no: data.period_no,
    exclude_id: id,
  });

  if (overlap) {
    const error = new Error("One teacher cannot have overlapping timetable periods");
    error.statusCode = 409;
    throw error;
  }

  return await classTimetableRepository.updateTimetable(id, data);
};

const deleteTimetable = async (id) => {
  return await classTimetableRepository.deleteTimetable(id);
};

module.exports = {
  createTimetable,
  getWeeklyTimetable,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
};
