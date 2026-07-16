const lookupService = require("../services/lookupService");
const { successResponse } = require("../helpers/response");

const getBranches = async (req, res, next) => {
  try {
    const result = await lookupService.getBranches();
    successResponse(res, "Branches fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const getSections = async (req, res, next) => {
  try {
    const result = await lookupService.getSections();
    successResponse(res, "Sections fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBranches,
  getSections,
};
