const db = require("../config/db");

// Check whether car exists
const checkCarExists = async (carId) => {
  const [rows] = await db.query("SELECT id FROM cars WHERE id = ?", [carId]);

  return rows;
};

// Insert new telemetry log
const insertTelemetry = async (telemetryData) => {
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
  } = telemetryData;

  const [result] = await db.query(
    `INSERT INTO iot_logs
        (
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
            vehicle_health
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
    ],
  );

  return result;
};

// Get latest telemetry of one car
const getLatestTelemetryByCarId = async (carId) => {
  const [rows] = await db.query(
    `SELECT *
         FROM iot_logs
         WHERE car_id = ?
         ORDER BY recorded_at DESC
         LIMIT 1`,
    [carId],
  );

  return rows;
};

// Get telemetry history of one car
const getTelemetryHistoryByCarId = async (carId) => {
  const [rows] = await db.query(
    `SELECT *
         FROM iot_logs
         WHERE car_id = ?
         ORDER BY recorded_at DESC`,
    [carId],
  );

  return rows;
};

// Get telemetry logs of all vehicles
const getAllTelemetryLogs = async () => {
  const [rows] = await db.query(
    `SELECT
            i.*,
            c.name,
            c.brand,
            c.model
         FROM iot_logs i
         JOIN cars c
            ON i.car_id = c.id
         ORDER BY i.recorded_at DESC`,
  );

  return rows;
};

module.exports = {
  checkCarExists,
  insertTelemetry,
  getLatestTelemetryByCarId,
  getTelemetryHistoryByCarId,
  getAllTelemetryLogs,
};
