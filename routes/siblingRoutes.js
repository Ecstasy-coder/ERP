const express = require("express");
const router = express.Router();
const siblingController = require("../controllers/siblingController");

router.get("/all-siblings", siblingController.getAllSiblings);

module.exports = router;