const express = require("express");

const router = express.Router();

const termController = require("../controllers/termController");

router.post("/", termController.createTerm);

router.get("/", termController.getTerms);

router.get("/:id", termController.getTerm);

router.put("/:id", termController.updateTerm);

router.delete("/:id", termController.deleteTerm);

module.exports = router;