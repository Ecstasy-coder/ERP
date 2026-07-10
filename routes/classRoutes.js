const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  createClassValidation,
  updateClassValidation,
  listClassesValidation,
  classIdValidation,
} = require("../validations/classValidation");

router.post("/", createClassValidation, validationMiddleware, classController.createClass);
router.get("/", listClassesValidation, validationMiddleware, classController.getAllClasses);
router.get("/:id", classIdValidation, validationMiddleware, classController.getClassById);
router.put("/:id", updateClassValidation, validationMiddleware, classController.updateClass);
router.delete("/:id", classIdValidation, validationMiddleware, classController.deleteClass);

module.exports = router;