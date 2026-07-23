// ==========================================
// Fare Calculation Utility
// Phase 11 - Payment & Fare System
// ==========================================

const BOOKING_ADVANCE = 500;
const DELAY_CHARGE_PER_DAY = 1000;

/**
 * Calculate rental days
 */
const calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDifference = end - start;

  const rentalDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return rentalDays;
};

/**
 * Calculate base fare
 */
const calculateBaseFare = (pricePerDay, rentalDays) => {
  return pricePerDay * rentalDays;
};

/**
 * Calculate delay charge
 */
const calculateDelayCharge = (extraDays = 0) => {
  return extraDays * DELAY_CHARGE_PER_DAY;
};

/**
 * Calculate final fare
 */
const calculateFinalFare = ({
  startDate,
  endDate,
  pricePerDay,
  extraDays = 0,
}) => {
  const rentalDays = calculateRentalDays(startDate, endDate);

  const baseFare = calculateBaseFare(pricePerDay, rentalDays);

  const bookingAdvance = BOOKING_ADVANCE;

  const delayCharge = calculateDelayCharge(extraDays);

  const finalAmount = baseFare + bookingAdvance + delayCharge;

  return {
    rentalDays,
    baseFare,
    bookingAdvance,
    delayCharge,
    finalAmount,
  };
};

module.exports = {
  calculateRentalDays,
  calculateBaseFare,
  calculateDelayCharge,
  calculateFinalFare,
};
