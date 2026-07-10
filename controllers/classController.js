const classService = require("../services/classService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const createClass = async (req, res, next) => {
  try {
    const result = await classService.createClass(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const getAllClasses = async (req, res, next) => {
  try {
    const result = await classService.getAllClasses(req.query);
    successResponse(res, messages.DATA_FETCHED, result.items, 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const result = await classService.getClassById(req.params.id);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const result = await classService.updateClass(req.params.id, req.body);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const result = await classService.deleteClass(req.params.id);
    successResponse(res, messages.DATA_DELETED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};