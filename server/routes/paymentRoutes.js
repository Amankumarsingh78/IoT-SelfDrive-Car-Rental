const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/paymentController");

const authenticate = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

// User
router.post("/", authenticate, paymentController.createPayment);

router.get("/my", authenticate, paymentController.getMyPayments);

// Admin
router.get(
  "/",
  authenticate,
  authorize("admin"),
  paymentController.getAllPayments,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  paymentController.updatePaymentStatus,
);

module.exports = router;
