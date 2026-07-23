const express = require("express");

const router = express.Router();

const iotController = require("../controllers/iotController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// User APIs

router.post("/log", verifyToken, iotController.addTelemetry);

router.get(
  "/car/:id/status",
  verifyToken,
  iotController.getCurrentVehicleStatus,
);

// Admin APIs

router.get(
  "/logs",
  verifyToken,
  authorizeRoles("admin"),
  iotController.getAllVehicleTelemetry,
);

router.get(
  "/car/:id/logs",
  verifyToken,
  authorizeRoles("admin"),
  iotController.getVehicleHistory,
);

module.exports = router;
