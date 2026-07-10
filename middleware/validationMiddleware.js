const { validationResult } = require("express-validator");
const { errorResponse } = require("../helpers/response");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return errorResponse(res, "Validation failed", 400, formattedErrors);
  }

  return next();
};

module.exports = validationMiddleware;