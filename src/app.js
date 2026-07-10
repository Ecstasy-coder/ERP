const express = require("express");
const cors = require("cors");

// Routes
const meetingRoutes = require("./routes/meeting.routes");
const participantRoutes = require("./routes/participant.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/meetings", meetingRoutes);
app.use("/api/participants", participantRoutes);

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Meeting Scheduler Backend Running Successfully 🚀",
        version: "1.0.0",
        apis: {
            meetings: "/api/meetings",
            participants: "/api/participants"
        }
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Endpoint Not Found"
    });
});

module.exports = app;