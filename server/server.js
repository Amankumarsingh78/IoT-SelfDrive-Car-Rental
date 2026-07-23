require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ==============================
// Database Connection
// ==============================
const pool = require("./config/db");

// ==============================
// Routes
// ==============================
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const kycRoutes = require("./routes/kycRoutes");
const iotRoutes = require("./routes/iotRoutes");
const startIoTSimulator = require("./utils/iotSimulator");

// ==============================
// Authentication Middleware
// ==============================
const authenticate = require("./middleware/authMiddleware");

// ==============================
// Initialize Express App
// ==============================
const app = express();

// ======================================================
// Global Middleware
// ======================================================

// Enable Cross-Origin Requests
app.use(cors());

// Parse JSON Request Body
app.use(express.json());

// ======================================================
// API Routes
// =====================================================

// User CRUD Routes
app.use("/api/users", userRoutes);

// Authentication Routes Login Endpoint: POST /api/auth/login
app.use("/api/auth", authRoutes);

// Car Routes
app.use("/api/cars", carRoutes);

// Booking Routes
app.use("/api/bookings", bookingRoutes);

// Payment Routes
app.use("/api/payments", paymentRoutes);

// KYC Routes
app.use("/api/kyc", kycRoutes);

// IoT Routes
app.use("/api/iot", iotRoutes);

// ======================================================
// Protected Route (Temporary)
// Used only for testing JWT Authentication
// Remove or move this later to a dedicated controller.
// ======================================================

app.get("/api/profile", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// ======================================================
// Default Route
// ======================================================

app.get("/", (req, res) => {
  res.send("🚗 IoT Self Drive Car Rental Backend Running...");
});

// ======================================================
// Health Check Route
// ======================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy 🚀",
  });
});

// ======================================================
// Test Database Connection
// ======================================================

async function testDatabaseConnection() {
  try {
    // Get Connection from Pool
    const connection = await pool.getConnection();

    console.log("✅ Connected to MySQL Database");

    // Test Query
    const [rows] = await connection.query("SELECT NOW() AS currentTime");

    console.log("📅 Database Time:", rows[0].currentTime);

    // Release Connection Back to Pool
    connection.release();
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
  }
}

// Test DB Connection on Server Startup
testDatabaseConnection();
// Start IoT Simulator
startIoTSimulator();

// ======================================================
// Start Express Server
// ======================================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("==================================");
  console.log(`🚀 Server Running on Port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("==================================");
});
