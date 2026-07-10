const express = require("express");
const router = express.Router();

const assignmentController = require("../controllers/assignmentController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  createAssignmentValidation,
  assignmentQueryValidation,
  assignmentIdValidation,
} = require("../validations/assignmentValidation");

router.post("/", createAssignmentValidation, validationMiddleware, assignmentController.createAssignment);
router.get("/", assignmentQueryValidation, validationMiddleware, assignmentController.getAssignments);
router.put("/:id", assignmentIdValidation, validationMiddleware, assignmentController.updateAssignment);
router.delete("/:id", assignmentIdValidation, validationMiddleware, assignmentController.deleteAssignment);

module.exports = router;
