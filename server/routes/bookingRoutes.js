const express = require("express");

const router = express.Router();

const bookingController = require("../controllers/bookingController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

/**
 * User Create Booking
 * POST /api/bookings
 */
router.post("/", authenticateToken, bookingController.createBooking);

/**
 * User Own Bookings
 * GET /api/bookings/my
 */
router.get("/my", authenticateToken, bookingController.getMyBookings);

/**
 * Get Booking By ID
 */
router.get("/:id", authenticateToken, bookingController.getBookingById);

/**
 * Admin Get All Bookings
 */
router.get(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  bookingController.getAllBookings,
);

/**
 * Admin Update Booking
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  bookingController.updateBooking,
);

/**
 * Cancel Booking
 */
router.delete("/:id", authenticateToken, bookingController.cancelBooking);

module.exports = router;
