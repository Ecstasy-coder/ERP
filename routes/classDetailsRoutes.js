const express = require("express");
const router = express.Router();

const classDetailsController = require("../controllers/classDetailsController");
const validationMiddleware = require("../middleware/validationMiddleware");
const { classDetailsQueryValidation } = require("../validations/classDetailsValidation");

router.get("/", classDetailsQueryValidation, validationMiddleware, classDetailsController.getClassDetails);

module.exports = router;
