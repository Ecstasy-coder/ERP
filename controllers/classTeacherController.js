const classTeacherService = require("../services/classTeacherService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const createAssignment = async (req, res, next) => {
  try {
    const result = await classTeacherService.createAssignment(req.body, req.user);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const getAllAssignments = async (req, res, next) => {
  try {
    const result = await classTeacherService.getAllAssignments(req.query, req.user);
    successResponse(res, messages.DATA_FETCHED, result.items, 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
};

const getAssignmentById = async (req, res, next) => {
  try {
    const result = await classTeacherService.getAssignmentById(req.params.id);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const result = await classTeacherService.updateAssignment(req.params.id, req.body, req.user);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const result = await classTeacherService.softDeleteAssignment(req.params.id, req.user);
    successResponse(res, messages.DATA_DELETED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
