require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ==============================
// Middleware
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// User Routes
// ==============================
app.use("/api/users", userRoutes);

// ==============================
// Test Route
// ==============================
app.get("/", (req, res) => {
  res.send("IoT Car Rental Backend Running 🚗");
});

// ==============================
// Health Check API
// ==============================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy 🚀",
  });
});

// ==============================
// Test Database Connection
// ==============================
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("✅ Connected to MySQL Database");

    const [rows] = await connection.query("SELECT NOW() AS currentTime;");

    console.log("📅 Database Time:", rows[0].currentTime);

    connection.release();
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
  }
}

testDatabaseConnection();

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
