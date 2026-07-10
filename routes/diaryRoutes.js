const express = require("express");
const router = express.Router();

const diaryController = require("../controllers/diaryController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  createDiaryValidation,
  diaryQueryValidation,
  diaryIdValidation,
} = require("../validations/diaryValidation");

router.post("/", createDiaryValidation, validationMiddleware, diaryController.createDiary);
router.get("/", diaryQueryValidation, validationMiddleware, diaryController.getDiaries);
router.put("/:id", diaryIdValidation, validationMiddleware, diaryController.editDiary);
router.delete("/:id", diaryIdValidation, validationMiddleware, diaryController.deleteDiary);

module.exports = router;
