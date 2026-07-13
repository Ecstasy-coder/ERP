const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("Backend Running");
});

// Login Routes
app.use("/api", authRoutes);

// Profile Routes
app.use("/api/profile", profileRoutes);

app.listen(5000, () => {
    console.log("🚀 Server Running On Port 5000");
});