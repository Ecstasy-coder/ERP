const express = require("express");
const router = express.Router();

const idCardController = require("../controllers/idCardController");

// Preview in browser before downloading
// e.g. GET /api/id-cards/preview?ids=1,2,3
// e.g. GET /api/id-cards/preview?branch=ECS001&className=Grade 1&section=A
router.get("/preview", idCardController.previewCards);

// Generate & download PDF
// e.g. GET /api/id-cards/download?ids=1,2,3
// e.g. GET /api/id-cards/download?branch=ECS001&className=Grade 1&format=sheet
router.get("/download", idCardController.downloadCards);

module.exports = router;