const db = require("../config/db");

const locations = [
  { name: "GLA University", lat: 27.605, lng: 77.5937 },
  { name: "Mathura Junction", lat: 27.4924, lng: 77.6737 },
  { name: "Vrindavan", lat: 27.5804, lng: 77.7 },
  { name: "Goverdhan", lat: 27.5035, lng: 77.4625 },
  { name: "Agra", lat: 27.1767, lng: 78.0081 },
];

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const startIoTSimulator = () => {
  console.log("🚗 IoT Simulator Started...");

  setInterval(async () => {
    try {
      const [cars] = await db.query("SELECT id FROM cars");

      for (const car of cars) {
        const place = locations[random(0, locations.length - 1)];

        await db.query(
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
            car.id,
            random(0, 120),
            random(20, 100),
            random(50, 100),
            Math.random() > 0.2 ? "ON" : "OFF",
            Math.random() > 0.5 ? "Locked" : "Unlocked",
            place.lat + (Math.random() - 0.5) / 100,
            place.lng + (Math.random() - 0.5) / 100,
            place.name,
            random(1000, 50000),
            ["GOOD", "WARNING", "CRITICAL"][random(0, 2)],
          ],
        );
      }

      console.log("✅ IoT telemetry generated");
    } catch (error) {
      console.error("IoT Simulator Error:", error.message);
    }
  }, 5000);
};

module.exports = startIoTSimulator;
