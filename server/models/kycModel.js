const db = require("../config/db");

// Check duplicate Aadhaar or DL
const checkDuplicateKYC = async (aadhaarNumber, dlNumber) => {
  const [rows] = await db.execute(
    `
        SELECT *
        FROM kyc
        WHERE aadhaar_number = ?
           OR dl_number = ?
        `,
    [aadhaarNumber, dlNumber],
  );

  return rows;
};

// Check KYC by User ID
const checkKYCByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM kyc
    WHERE user_id = ?
    `,
    [userId],
  );

  return rows;
};

// Create KYC
const createKYC = async (
  userId,
  aadhaarNumber,
  dlNumber,
  aadhaarImage,
  dlImage,
) => {
  const [result] = await db.execute(
    `
        INSERT INTO kyc
        (
            user_id,
            aadhaar_number,
            dl_number,
            aadhaar_image,
            dl_image
        )
        VALUES (?, ?, ?, ?, ?)
        `,
    [userId, aadhaarNumber, dlNumber, aadhaarImage, dlImage],
  );

  return result;
};

// Get KYC by User ID
const getKYCByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
        SELECT *
        FROM kyc
        WHERE user_id = ?
        `,
    [userId],
  );

  return rows;
};

// Get Pending KYC
const getPendingKYC = async () => {
  const [rows] = await db.execute(
    `
        SELECT
            k.*,
            u.name,
            u.email
        FROM kyc k
        JOIN users u
            ON k.user_id = u.id
        WHERE verification_status = 'pending'
        ORDER BY created_at DESC
        `,
  );

  return rows;
};

// Verify KYC
const verifyKYC = async (id, status, remarks, verifiedBy) => {
  const [result] = await db.execute(
    `
        UPDATE kyc
        SET
            verification_status = ?,
            remarks = ?,
            verified_by = ?,
            verified_at = NOW()
        WHERE id = ?
        `,
    [status, remarks, verifiedBy, id],
  );

  return result;
};

module.exports = {
  checkDuplicateKYC,
  createKYC,
  getKYCByUserId,
  getPendingKYC,
  verifyKYC,
  checkKYCByUserId,
};
