const teacherService = require("../services/teacherService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const assignTeacher = async (req, res, next) => {
  try {
    const result = await teacherService.assignTeacher(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const updateTeacherAssignment = async (req, res, next) => {
  try {
    const result = await teacherService.updateTeacherAssignment(req.params.id, req.body);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const removeTeacherAssignment = async (req, res, next) => {
  try {
    const result = await teacherService.removeTeacherAssignment(req.params.id);
    successResponse(res, messages.DATA_DELETED, result);
  } catch (error) {
    next(error);
  }
};

const getTeachersByClass = async (req, res, next) => {
  try {
    const result = await teacherService.getTeachersByClass(req.params.classId);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignTeacher,
  updateTeacherAssignment,
  removeTeacherAssignment,
  getTeachersByClass,
};
