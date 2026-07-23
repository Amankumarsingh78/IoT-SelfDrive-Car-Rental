const bookingModel = require("../models/bookingModel");
const { calculateFinalFare } = require("../utils/fareCalculator");

/**
 * Create Booking
 */
const createBooking = async (req, res) => {
  try {
    const { car_id, pickup_location, drop_location, start_date, end_date } =
      req.body;

    const user_id = req.user.id;

    // Validation
    if (
      !car_id ||
      !pickup_location ||
      !drop_location ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }

    // Check user exists
    const user = await bookingModel.userExists(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check car exists
    const car = await bookingModel.carExists(car_id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check car availability
    const carStatus = await bookingModel.checkCarAvailability(car_id);

    if (carStatus.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Car is not available",
      });
    }

    // Validate booking dates
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking dates",
      });
    }

    // Get car price
    const carPrice = await bookingModel.getCarPrice(car_id);

    // Calculate Fare
    const fare = calculateFinalFare({
      startDate: start_date,
      endDate: end_date,
      pricePerDay: carPrice.price_per_day,
    });

    const total_price = fare.finalAmount;

    // Create booking
    const booking = await bookingModel.createBooking({
      user_id,
      car_id,
      pickup_location,
      drop_location,
      start_date,
      end_date,
      total_price,
    });

    // Update car status
    await bookingModel.updateCarStatus(car_id, "rented");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking_id: booking.insertId,
      total_price,
      fare,
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
 * Get All Bookings (Admin)
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
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
 * Get My Bookings
 */
const getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const bookings = await bookingModel.getBookingsByUserId(user_id);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
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
 * Get Booking By ID
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookingModel.getBookingById(id);

    if (booking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking[0],
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
 * Update Booking Status (Admin)
 */
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, payment_status } = req.body;

    if (!status && !payment_status) {
      return res.status(400).json({
        success: false,
        message: "Update data required",
      });
    }

    const booking = await bookingModel.getBookingById(id);

    if (booking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const result = await bookingModel.updateBooking(id, {
      status,
      payment_status,
    });

    res.status(200).json({
      success: true,

      message: "Booking updated successfully",

      data: result,
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
 * Cancel Booking
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookingModel.getBookingById(id);

    if (booking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await bookingModel.cancelBooking(id);

    await bookingModel.updateCarStatus(booking[0].car_id, "available");

    res.status(200).json({
      success: true,

      message: "Booking cancelled successfully",
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
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
};
