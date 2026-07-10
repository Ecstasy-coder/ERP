const classDetailsService = require("../services/classDetailsService");
const { successResponse } = require("../helpers/response");
const messages = require("../constants/messages");

const getClassDetails = async (req, res, next) => {
  try {
    const result = await classDetailsService.getClassDetails(req.query);
    successResponse(res, messages.DATA_FETCHED, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClassDetails,
};
