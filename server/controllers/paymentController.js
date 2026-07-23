const paymentModel = require("../models/paymentModel");
const bookingModel = require("../models/bookingModel");
const fareCalculator = require("../utils/fareCalculator");
const carModel = require("../models/carModel");

/**
 * Create Payment
 */
const createPayment = async (req, res) => {
  try {
    const { booking_id, payment_method } = req.body;

    const user_id = req.user.id;

    // Validation
    if (!booking_id || !payment_method) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and payment method are required",
      });
    }

    // Validate payment method
    const allowedMethods = ["upi", "cash"];

    if (!allowedMethods.includes(payment_method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Check user exists
    const user = await paymentModel.userExists(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check booking exists
    const booking = await paymentModel.bookingExists(booking_id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check cancelled booking
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot pay cancelled booking",
      });
    }

    // Check booking ownership
    if (booking.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to booking",
      });
    }

    // Check payment already completed
    if (booking.payment_status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    // Get Car Details
    const car = await carModel.getCarById(booking.car_id);

    if (!car || car.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Calculate Fare
    const fare = fareCalculator.calculateFinalFare({
      startDate: booking.start_date,
      endDate: booking.end_date,
      pricePerDay: car[0].price_per_day,
    });

    // Generate Transaction ID
    const transaction_id = `TXN${Date.now()}`;

    // Create Payment
    const payment = await paymentModel.createPayment({
      booking_id,
      user_id,
      amount: fare.finalAmount,
      payment_method,
      transaction_id,
      payment_status: "paid",
    });

    // Update booking payment status
    await bookingModel.updateBookingPaymentStatus(booking_id, "paid");

    res.status(201).json({
      success: true,
      message: "Payment successful",
      payment_id: payment.insertId,
      transaction_id,
      amount: fare.finalAmount,
      payment_status: "paid",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get My Payments
 */
const getMyPayments = async (req, res) => {
  try {
    const user_id = req.user.id;

    const payments = await paymentModel.getPaymentsByUserId(user_id);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get All Payments (Admin)
 */
const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Update Payment Status (Admin)
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { payment_status } = req.body;

    if (!payment_status) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    const payment = await paymentModel.getPaymentById(id);

    if (payment.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await paymentModel.updatePaymentStatus(id, payment_status);

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus,
};
