const db = require("../config/db");

/**
 * Get user details for login
 */
const getUserForLogin = async (email) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        role
      FROM users
      WHERE email = ?
      `,
      [email],
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserForLogin,
};
