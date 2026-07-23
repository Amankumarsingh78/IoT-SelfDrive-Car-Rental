const db = require("../config/db");

/**
 * Check booking exists
 */
const bookingExists = async (booking_id) => {
  const [rows] = await db.query("SELECT * FROM bookings WHERE id = ?", [
    booking_id,
  ]);

  return rows[0];
};

/**
 * Check user exists
 */
const userExists = async (user_id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);

  return rows[0];
};

/**
 * Create payment
 */
const createPayment = async (paymentData) => {
  const {
    booking_id,
    user_id,
    amount,
    payment_method,
    transaction_id,
    payment_status,
  } = paymentData;

  const [result] = await db.query(
    `INSERT INTO payments
    (booking_id, user_id, amount, payment_method, transaction_id, payment_status)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      booking_id,
      user_id,
      amount,
      payment_method,
      transaction_id,
      payment_status,
    ],
  );

  return result;
};

/**
 * Get payments by user
 */
const getPaymentsByUserId = async (user_id) => {
  const [rows] = await db.query(
    "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC",
    [user_id],
  );

  return rows;
};

/**
 * Get all payments
 */
const getAllPayments = async () => {
  const [rows] = await db.query(
    "SELECT * FROM payments ORDER BY created_at DESC",
  );

  return rows;
};

/**
 * Get payment by ID
 */
const getPaymentById = async (id) => {
  const [rows] = await db.query("SELECT * FROM payments WHERE id = ?", [id]);

  return rows;
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (id, payment_status) => {
  const [result] = await db.query(
    "UPDATE payments SET payment_status = ? WHERE id = ?",
    [payment_status, id],
  );

  return result;
};

module.exports = {
  bookingExists,
  userExists,
  createPayment,
  getPaymentsByUserId,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
};
