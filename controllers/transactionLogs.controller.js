const service = require("../services/transactionLogs.service");

// GET /api/transaction-logs  → returns JSON
const getLogs = async (req, res) => {
  try {
    const result = await service.getTransactionLogs(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/transaction-logs/export  → streams Excel file
const exportExcel = async (req, res) => {
  try {
    const workbook = await service.exportTransactionLogsToExcel(req.query);

    const filename = `transaction_logs_${Date.now()}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getLogs, exportExcel };
