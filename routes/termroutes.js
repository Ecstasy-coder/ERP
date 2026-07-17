const express = require('express');
const router = express.Router();
const termController = require('../controllers/termController');

// Summary table - all 3 terms for a student (image 2)
router.get('/students/:studentId/terms', termController.getAllTerms);

// Update all terms for a student using one URL
router.put('/students/:studentId/terms', termController.updateAllTerms);

// Single term - prefill the pay/edit form (image 1)
router.get('/students/:studentId/terms/:termNumber', termController.getTermByNumber);

// Submit the pay/edit form for a single term
router.put('/students/:studentId/terms/:termNumber', termController.updateTerm);

// Payment type dropdown options
router.get('/payment-types', termController.getPaymentTypes);

// Diagnostic endpoint - check data for a student
router.get('/students/:studentId/diagnostic', termController.getDiagnostic);
router.put('/students/:studentId/diagnostic', termController.updateDiagnostic);

// Get available terms for a student
router.get('/students/:studentId/available-terms', termController.getAvailableTerms);

// Update all terms at once for a student
router.put('/students/:studentId/diagnostic/batch', termController.updateAllTerms);

module.exports = router;