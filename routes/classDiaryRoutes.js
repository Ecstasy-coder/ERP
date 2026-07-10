const express = require("express");
const router = express.Router();

const classDiaryController = require("../controllers/classDiaryController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  classDiaryValidation,
  classDiaryQueryValidation,
  classDiaryIdValidation,
} = require("../validations/classDiaryValidation");

router.post("/", classDiaryValidation, validationMiddleware, classDiaryController.createDiary);
router.get("/", classDiaryQueryValidation, validationMiddleware, classDiaryController.getDiaries);
router.get("/:id", classDiaryIdValidation, validationMiddleware, classDiaryController.getDiaryById);
router.put("/:id", classDiaryIdValidation, validationMiddleware, classDiaryController.updateDiary);
router.delete("/:id", classDiaryIdValidation, validationMiddleware, classDiaryController.deleteDiary);

module.exports = router;
