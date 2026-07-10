const assignmentService = require("../services/assignmentService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const createAssignment = async (req, res, next) => {
  try {
    const result = await assignmentService.createAssignment(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const result = await assignmentService.updateAssignment(req.params.id, req.body);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const result = await assignmentService.deleteAssignment(req.params.id);
    successResponse(res, messages.DATA_DELETED, result);
  } catch (error) {
    next(error);
  }
};

const getAssignments = async (req, res, next) => {
  try {
    const result = await assignmentService.getAssignments(req.query);
    successResponse(res, messages.DATA_FETCHED, result.items, 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignments,
};
