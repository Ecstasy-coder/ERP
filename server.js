require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const morgan     = require("morgan");

const routes                   = require("./routes/index");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const initDatabase = require("./sql/initDatabase");

const app  = express();
const PORT = process.env.PORT || 5000;

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
const startServer = async () => {
  try {
    // Create tables if they don't exist
    await initDatabase();

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
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;

