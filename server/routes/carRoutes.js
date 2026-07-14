const express = require("express");

const router = express.Router();

const carController = require("../controllers/carController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * Public Routes
 */

// Get all cars
router.get("/", carController.getAllCars);

// Get car by ID
router.get("/:id", carController.getCarById);

/**
 * Admin Only Routes
 */

// Create car
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  carController.createCar,
);

// Update car
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  carController.updateCar,
);

// Delete car
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  carController.deleteCar,
);

module.exports = router;
