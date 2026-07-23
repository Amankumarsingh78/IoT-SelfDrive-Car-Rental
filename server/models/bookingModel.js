const db = require("../config/db");

/**
 * Check user exists
 */
const userExists = async (user_id) => {
  const [rows] = await db.query(
    `
      SELECT id
      FROM users
      WHERE id = ?
    `,
    [user_id],
  );

  return rows[0];
};

/**
 * Check car exists
 */
const carExists = async (car_id) => {
  const [rows] = await db.query(
    `
      SELECT id
      FROM cars
      WHERE id = ?
    `,
    [car_id],
  );

  return rows[0];
};

/**
 * Check car availability
 */
const checkCarAvailability = async (car_id) => {
  const [rows] = await db.query(
    `
      SELECT
        id,
        status
      FROM cars
      WHERE id = ?
    `,
    [car_id],
  );

  return rows[0];
};

/**
 * Get car price
 */
const getCarPrice = async (car_id) => {
  const [rows] = await db.query(
    `
      SELECT
        price_per_day
      FROM cars
      WHERE id = ?
    `,
    [car_id],
  );

  return rows[0];
};

/**
 * Create booking
 */
const createBooking = async (bookingData) => {
  const {
    user_id,
    car_id,
    pickup_location,
    drop_location,
    start_date,
    end_date,
    total_price,
  } = bookingData;

  const [result] = await db.query(
    `
      INSERT INTO bookings
      (
        user_id,
        car_id,
        pickup_location,
        drop_location,
        start_date,
        end_date,
        total_price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      user_id,
      car_id,
      pickup_location,
      drop_location,
      start_date,
      end_date,
      total_price,
    ],
  );

  return result;
};

/**
 * Get all bookings
 */
const getAllBookings = async () => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM bookings
      ORDER BY id ASC
    `,
  );

  return rows;
};

/**
 * Get booking by ID
 */
const getBookingById = async (id) => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM bookings
      WHERE id = ?
    `,
    [id],
  );

  return rows;
};

/**
 * Get bookings by user
 */
const getBookingsByUserId = async (user_id) => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM bookings
      WHERE user_id = ?
      ORDER BY id DESC
    `,
    [user_id],
  );

  return rows;
};

/**
 * Update booking
 */
const updateBooking = async (id, bookingData) => {
  const { status, payment_status } = bookingData;

  const [result] = await db.query(
    `
      UPDATE bookings
      SET
        status = ?,
        payment_status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [status, payment_status, id],
  );

  return result;
};

/**
 * Update car status
 */
const updateCarStatus = async (car_id, status) => {
  const [result] = await db.query(
    `
      UPDATE cars
      SET
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [status, car_id],
  );

  return result;
};

/**
 * Update Booking Payment Status
 */
const updateBookingPaymentStatus = async (booking_id, payment_status) => {
  const [result] = await db.query(
    `
      UPDATE bookings
      SET
        payment_status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [payment_status, booking_id],
  );

  return result;
};

/**
 * Delete booking
 */
const deleteBooking = async (id) => {
  const [result] = await db.query(
    `
      DELETE FROM bookings
      WHERE id = ?
    `,
    [id],
  );

  return result;
};

/**
 * Cancel Booking
 */
const cancelBooking = async (id) => {
  const [result] = await db.query(
    `
      UPDATE bookings
      SET
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [id],
  );

  return result;
};

module.exports = {
  userExists,
  carExists,
  checkCarAvailability,
  getCarPrice,
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  updateBooking,
  updateCarStatus,
  deleteBooking,
  cancelBooking,
  updateBookingPaymentStatus,
};
