const iotModel = require("../models/iotModel");

// Insert telemetry
const addTelemetry = async (req, res) => {
  try {
    const {
      car_id,
      speed,
      fuel_level,
      battery_level,
      engine_status,
      lock_status,
      latitude,
      longitude,
      location,
      odometer,
      vehicle_health,
    } = req.body;

    // Required fields
    if (
      !car_id ||
      speed === undefined ||
      fuel_level === undefined ||
      battery_level === undefined ||
      !engine_status ||
      !lock_status ||
      latitude === undefined ||
      longitude === undefined ||
      !location ||
      odometer === undefined ||
      !vehicle_health
    ) {
      return res.status(400).json({
        success: false,
        message: "All telemetry fields are required",
      });
    }

    // Check car exists
    const car = await iotModel.checkCarExists(car_id);

    if (car.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Sensor validation
    if (speed < 0)
      return res.status(400).json({
        success: false,
        message: "Speed cannot be negative",
      });

    if (fuel_level < 0 || fuel_level > 100)
      return res.status(400).json({
        success: false,
        message: "Fuel level must be between 0 and 100",
      });

    if (battery_level < 0 || battery_level > 100)
      return res.status(400).json({
        success: false,
        message: "Battery level must be between 0 and 100",
      });

    const result = await iotModel.insertTelemetry(req.body);

    return res.status(201).json({
      success: true,
      message: "Telemetry inserted successfully",
      telemetry_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Latest telemetry
const getCurrentVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await iotModel.getLatestTelemetryByCarId(id);

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No telemetry found",
      });
    }

    return res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Vehicle history
const getVehicleHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await iotModel.getTelemetryHistoryByCarId(id);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// All telemetry
const getAllVehicleTelemetry = async (req, res) => {
  try {
    const data = await iotModel.getAllTelemetryLogs();

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addTelemetry,
  getCurrentVehicleStatus,
  getVehicleHistory,
  getAllVehicleTelemetry,
};
