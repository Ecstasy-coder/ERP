const classAttendanceService = require("../services/classAttendanceService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const getStudentsForAttendance = async (req, res, next) => {
  try {
    const result = await classAttendanceService.getStudentsForAttendance(req.query);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

const markAttendance = async (req, res, next) => {
  try {
    const result = await classAttendanceService.markAttendance(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const getAttendanceReport = async (req, res, next) => {
  try {
    const result = await classAttendanceService.getAttendanceReport(req.query);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentsForAttendance,
  markAttendance,
  getAttendanceReport,
};
