const express = require("express");
const router  = express.Router();

const invalidFeeDataCtrl   = require("../controllers/invalidFeeData.controller");
const invalidFeeTotalsCtrl = require("../controllers/invalidFeeTotals.controller");
const feeNotGeneratedCtrl  = require("../controllers/feeNotGenerated.controller");
const transactionLogsCtrl  = require("../controllers/transactionLogs.controller");

// ─────────────────────────────────────────────
// Sub-module 1: Invalid Fee Data
// GET    /api/invalid-fee-data            → list all (filters: student_id, status, from_date, to_date, page, limit)
// GET    /api/invalid-fee-data/:id        → single record
// POST   /api/invalid-fee-data            → create record
// PATCH  /api/invalid-fee-data/:id/status → update status
// ─────────────────────────────────────────────
router.get   ("/invalid-fee-data",            invalidFeeDataCtrl.getAll);
router.get   ("/invalid-fee-data/:id",        invalidFeeDataCtrl.getById);
router.post  ("/invalid-fee-data",            invalidFeeDataCtrl.create);
router.patch ("/invalid-fee-data/:id/status", invalidFeeDataCtrl.updateStatus);

// ─────────────────────────────────────────────
// Sub-module 2: Invalid Fee Totals
// GET    /api/invalid-fee-totals                       → list all (filters: student_id, current_class, page, limit)
// GET    /api/invalid-fee-totals/student/:student_id   → totals for one student
// ─────────────────────────────────────────────
router.get("/invalid-fee-totals",                     invalidFeeTotalsCtrl.getAll);
router.get("/invalid-fee-totals/student/:student_id", invalidFeeTotalsCtrl.getByStudent);

// ─────────────────────────────────────────────
// Sub-module 3: Fee Not Generated
// GET    /api/fee-not-generated            → list all (filters: student_id, status, from_date, to_date, page, limit)
// GET    /api/fee-not-generated/:id        → single record
// POST   /api/fee-not-generated            → create record
// PATCH  /api/fee-not-generated/:id/status → update status
// ─────────────────────────────────────────────
router.get   ("/fee-not-generated",            feeNotGeneratedCtrl.getAll);
router.get   ("/fee-not-generated/:id",        feeNotGeneratedCtrl.getById);
router.post  ("/fee-not-generated",            feeNotGeneratedCtrl.create);
router.patch ("/fee-not-generated/:id/status", feeNotGeneratedCtrl.updateStatus);

// ─────────────────────────────────────────────
// Sub-module 4: Transaction Logs
// GET    /api/transaction-logs       
//   → JSON logs (filters: log_type, student_id, from_date, to_date, page, limit)
// GET    /api/transaction-logs/export  → Download Excel file (all 4 sheets)
// ─────────────────────────────────────────────
router.get("/transaction-logs/export", transactionLogsCtrl.exportExcel);  // must be before /:id
router.get("/transaction-logs",        transactionLogsCtrl.getLogs);

module.exports = router;
