const classDiaryService = require("../services/classDiaryService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const createDiary = async (req, res, next) => {
  try {
    const result = await classDiaryService.createDiary(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const getDiaries = async (req, res, next) => {
  try {
    const result = await classDiaryService.getDiaries(req.query);
    successResponse(res, messages.DATA_FETCHED, result.items, 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
};

const getDiaryById = async (req, res, next) => {
  try {
    const result = await classDiaryService.getDiaryById(req.params.id);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

const updateDiary = async (req, res, next) => {
  try {
    const result = await classDiaryService.updateDiary(req.params.id, req.body);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const deleteDiary = async (req, res, next) => {
  try {
    const result = await classDiaryService.deleteDiary(req.params.id);
    successResponse(res, messages.DATA_DELETED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDiary,
  getDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary,
};
