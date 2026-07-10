const classTimetableService = require("../services/classTimetableService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const createTimetable = async (req, res, next) => {
  try {
    const result = await classTimetableService.createTimetable(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const getWeeklyTimetable = async (req, res, next) => {
  try {
    const result = await classTimetableService.getWeeklyTimetable(req.query);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

const getTimetableById = async (req, res, next) => {
  try {
    const result = await classTimetableService.getTimetableById(req.params.id);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

const updateTimetable = async (req, res, next) => {
  try {
    const result = await classTimetableService.updateTimetable(req.params.id, req.body);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const deleteTimetable = async (req, res, next) => {
  try {
    const result = await classTimetableService.deleteTimetable(req.params.id);
    successResponse(res, messages.DATA_DELETED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTimetable,
  getWeeklyTimetable,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
};
