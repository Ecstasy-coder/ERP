const express = require("express");
const router = express.Router();

const lookupController = require("../controllers/lookupController");

router.get("/branches", lookupController.getBranches);
router.get("/sections", lookupController.getSections);

module.exports = router;
