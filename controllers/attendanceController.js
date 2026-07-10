const attendanceService = require("../services/attendanceService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const markAttendance = async (req, res, next) => {
  try {
    const result = await attendanceService.markAttendance(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const bulkAttendance = async (req, res, next) => {
  try {
    const result = await attendanceService.bulkAttendance(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const result = await attendanceService.updateAttendance(req.params.id, req.body);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const getTodayAttendance = async (req, res, next) => {
  try {
    const result = await attendanceService.getTodayAttendance();
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

const getMonthlyAttendance = async (req, res, next) => {
  try {
    const result = await attendanceService.getMonthlyAttendance(req.query.month, req.query.year);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

const getAttendanceReport = async (req, res, next) => {
  try {
    const result = await attendanceService.getAttendanceReport(req.query);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  bulkAttendance,
  updateAttendance,
  getTodayAttendance,
  getMonthlyAttendance,
  getAttendanceReport,
};
