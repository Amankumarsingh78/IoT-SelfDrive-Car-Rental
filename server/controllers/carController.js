const carModel = require("../models/carModel");

/**
 * GET /api/cars
 * Fetch all cars
 */
const getAllCars = async (req, res) => {
  try {
    const cars = await carModel.getAllCars();

    return res.status(200).json({
      success: true,
      message: "Cars fetched successfully",
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * POST /api/cars
 * Create new car
 */
const createCar = async (req, res) => {
  try {
    const carData = { ...req.body };

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

    // Required field validation
    if (
      !name ||
      !registration_number ||
      !fuel_type ||
      !transmission ||
      !seating_capacity ||
      !price_per_day
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Check duplicate registration number
    const existingCar =
      await carModel.getCarByRegistrationNumber(registration_number);

    if (existingCar) {
      return res.status(409).json({
        success: false,
        message: "Registration number already exists",
      });
    }

    // Create new car
    const result = await carModel.createCar({
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
    });

    return res.status(201).json({
      success: true,
      message: "Car created successfully",
      carId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating car:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry found",
      });
    }

    if (error.code === "WARN_DATA_TRUNCATED") {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * GET /api/cars/:id
 * Get car by ID
 */
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const cars = await carModel.getCarById(id);

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cars[0],
    });
  } catch (error) {
    console.error("Error fetching car:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * PUT /api/cars/:id
 * Update car
 */
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

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
    } = req.body;

    // Required field validation
    if (
      !name ||
      !registration_number ||
      !fuel_type ||
      !transmission ||
      !seating_capacity ||
      !price_per_day
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Check if car exists
    const existingCar = await carModel.getCarById(id);

    if (existingCar.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check duplicate registration number
    const duplicateCar = await carModel.getCarByRegistrationNumberExceptId(
      registration_number,
      id,
    );

    if (duplicateCar.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Registration number already exists",
      });
    }
    // Update car
    await carModel.updateCar(id, {
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
    });

    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
    });
  } catch (error) {
    console.error("Error updating car:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * DELETE /api/cars/:id
 * Delete car
 */
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if car exists
    const existingCar = await carModel.getCarById(id);

    if (existingCar.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Delete car
    await carModel.deleteCar(id);

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting car:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllCars,
  createCar,
  getCarById,
  updateCar,
  deleteCar,
};
