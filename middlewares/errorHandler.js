// Global error handler — catches anything not caught in controllers
const errorHandler = (err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success : false,
    message : err.message || "Internal Server Error",
  });
};

// 404 handler
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };
