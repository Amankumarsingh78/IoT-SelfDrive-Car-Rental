const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

/**
 * GET /api/users
 * Fetch all users
 */
router.get("/", userController.getAllUsers);

// Get user by ID
router.get("/:id", userController.getUserById);
/**
 * POST /api/users
 * Create a new user
 */
router.post("/", userController.createUser);
// Get user by ID
router.get("/:id", userController.getUserById);
// Update user
router.put("/:id", userController.updateUser);
// Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
