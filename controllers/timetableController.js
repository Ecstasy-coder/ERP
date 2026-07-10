const timetableService = require("../services/timetableService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const createTimetable = async (req, res, next) => {
  try {
    const result = await timetableService.createTimetable(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const updateTimetable = async (req, res, next) => {
  try {
    const result = await timetableService.updateTimetable(req.params.id, req.body);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const deleteTimetable = async (req, res, next) => {
  try {
    const result = await timetableService.deleteTimetable(req.params.id);
    successResponse(res, messages.DATA_DELETED, result);
  } catch (error) {
    next(error);
  }
};

const getWeeklyTimetable = async (req, res, next) => {
  try {
    const result = await timetableService.getWeeklyTimetable(req.params.classId);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getWeeklyTimetable,
};
