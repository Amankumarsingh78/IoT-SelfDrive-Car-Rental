const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

/**
 * POST /api/users
 * Public Route - Register User
 */
router.post("/", userController.createUser);

/**
 * GET /api/users
 * Admin Only
 */
router.get("/", authenticate, authorize("admin"), userController.getAllUsers);

/**
 * GET /api/users/:id
 * Admin Only
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.getUserById,
);

/**
 * PUT /api/users/:id
 * Admin Only
 */
router.put("/:id", authenticate, authorize("admin"), userController.updateUser);

/**
 * DELETE /api/users/:id
 * Admin Only
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.deleteUser,
);

module.exports = router;
