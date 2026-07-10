const express = require("express");
const router = express.Router();

const classAssignmentController = require("../controllers/classAssignmentController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  classAssignmentValidation,
  classAssignmentQueryValidation,
  classAssignmentIdValidation,
} = require("../validations/classAssignmentValidation");

router.post("/", classAssignmentValidation, validationMiddleware, classAssignmentController.createAssignment);
router.get("/", classAssignmentQueryValidation, validationMiddleware, classAssignmentController.getAssignments);
router.get("/:id", classAssignmentIdValidation, validationMiddleware, classAssignmentController.getAssignmentById);
router.put("/:id", classAssignmentIdValidation, validationMiddleware, classAssignmentController.updateAssignment);
router.delete("/:id", classAssignmentIdValidation, validationMiddleware, classAssignmentController.deleteAssignment);

module.exports = router;
