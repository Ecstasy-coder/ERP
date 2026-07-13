const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const attenderController = require("../controllers/attenderController");

router.post(
  "/",
  upload.single("photo"),
  attenderController.createAttender
);

router.get(
  "/",
  attenderController.getAttenders
);

router.get(
  "/:id",
  attenderController.getAttenderById
);

router.put(
  "/:id",
  upload.single("photo"),
  attenderController.updateAttender
);

router.delete(
  "/:id",
  attenderController.deleteAttender
);

module.exports = router;
