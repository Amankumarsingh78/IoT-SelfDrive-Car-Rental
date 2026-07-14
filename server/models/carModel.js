const db = require("../config/db");

/**
 * Get all cars
 */
const getAllCars = async () => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        brand,
        model,
        registration_number,
        fuel_type,
        transmission,
        seating_capacity,
        price_per_day,
        status,
        location,
        image_url,
        created_at,
        updated_at
      FROM cars
      ORDER BY id ASC
    `);

    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get car by ID
 */
const getCarById = async (id) => {
  const [rows] = await db.query(
    `
      SELECT
        id,
        name,
        brand,
        model,
        registration_number,
        fuel_type,
        transmission,
        seating_capacity,
        price_per_day,
        status,
        location,
        image_url,
        created_at,
        updated_at
      FROM cars
      WHERE id = ?
    `,
    [id],
  );

  return rows;
};

/**
 * Get car by registration number
 */
const getCarByRegistrationNumber = async (registration_number) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        registration_number
      FROM cars
      WHERE registration_number = ?
      `,
      [registration_number],
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Get registration number except current ID
 */
const getCarByRegistrationNumberExceptId = async (registration_number, id) => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM cars
      WHERE registration_number = ?
      AND id != ?
    `,
    [registration_number, id],
  );

  return rows;
};

/**
 * Create new car
 */
const createCar = async (carData) => {
  try {
    const {
      name,
      brand,
      model,
      registration_number,
      fuel_type,
      transmission,
      seating_capacity,
      price_per_day,
      status,
      location,
      image_url,
    } = carData;

    const [result] = await db.query(
      `
      INSERT INTO cars
      (
        name,
        brand,
        model,
        registration_number,
        fuel_type,
        transmission,
        seating_capacity,
        price_per_day,
        status,
        location,
        image_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        brand,
        model,
        registration_number,
        fuel_type,
        transmission,
        seating_capacity,
        price_per_day,
        status,
        location,
        image_url,
      ],
    );

    return result;
  } catch (error) {
    console.error("========== ERROR ==========");
    console.error(error);
    console.error(error.message);
    console.error("===========================");

    throw error;
  }
};

/**
 * Update car
 */
const updateCar = async (id, carData) => {
  const {
    name,
    brand,
    model,
    registration_number,
    fuel_type,
    transmission,
    seating_capacity,
    price_per_day,
    status,
    location,
    image_url,
  } = carData;

  const [result] = await db.query(
    `
      UPDATE cars
      SET
        name = ?,
        brand = ?,
        model = ?,
        registration_number = ?,
        fuel_type = ?,
        transmission = ?,
        seating_capacity = ?,
        price_per_day = ?,
        status = ?,
        location = ?,
        image_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      name,
      brand,
      model,
      registration_number,
      fuel_type,
      transmission,
      seating_capacity,
      price_per_day,
      status,
      location,
      image_url,
      id,
    ],
  );

  return result;
};

/**
 * Delete car
 */
const deleteCar = async (id) => {
  const [result] = await db.query(
    `
      DELETE FROM cars
      WHERE id = ?
    `,
    [id],
  );

  return result;
};

module.exports = {
  getAllCars,
  getCarById,
  getCarByRegistrationNumber,
  getCarByRegistrationNumberExceptId,
  createCar,
  updateCar,
  deleteCar,
};
