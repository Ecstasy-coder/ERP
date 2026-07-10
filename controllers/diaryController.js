const diaryService = require("../services/diaryService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const createDiary = async (req, res, next) => {
  try {
    const result = await diaryService.createDiary(req.body);
    successResponse(res, messages.DATA_CREATED, result, 201);
  } catch (error) {
    next(error);
  }
};

const editDiary = async (req, res, next) => {
  try {
    const result = await diaryService.editDiary(req.params.id, req.body);
    successResponse(res, messages.DATA_UPDATED, result);
  } catch (error) {
    next(error);
  }
};

const deleteDiary = async (req, res, next) => {
  try {
    const result = await diaryService.deleteDiary(req.params.id);
    successResponse(res, messages.DATA_DELETED, result);
  } catch (error) {
    next(error);
  }
};

const getDiaries = async (req, res, next) => {
  try {
    const result = await diaryService.getDiaries(req.query);
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
  createDiary,
  editDiary,
  deleteDiary,
  getDiaries,
};
