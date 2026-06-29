require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const morgan     = require("morgan");

const routes                   = require("./routes/index");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Health check ───────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ── Fee Module Routes ──────────────────────────
app.use("/api", routes);

// ── 404 + Error Handlers ───────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Fee Module Server running on http://localhost:${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET  /api/invalid-fee-data`);
  console.log(`   POST /api/invalid-fee-data`);
  console.log(`   GET  /api/invalid-fee-totals`);
  console.log(`   GET  /api/fee-not-generated`);
  console.log(`   POST /api/fee-not-generated`);
  console.log(`   GET  /api/transaction-logs`);
  console.log(`   GET  /api/transaction-logs/export  ← Excel download\n`);
});

module.exports = app;

