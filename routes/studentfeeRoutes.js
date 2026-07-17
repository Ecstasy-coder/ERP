const express = require('express');
const router = express.Router();
const feeController = require('../controllers/studentfeeController');

router.get('/students/:studentId/terms', feeController.getTerms);
router.get('/receipt-number', feeController.getReceiptNo);
router.put('/terms/:termFeeId', feeController.updateTerm);

module.exports = router;