const db = require("../config/db");

/**
 * Get all users
 */
const getAllUsers = async () => {
  try {
    const [rows] = await db.query(`
            SELECT
                id,
                name,
                email,
                phone,
                role,
                created_at,
                updated_at
            FROM users
            ORDER BY id ASC
        `);

    return rows;
  } catch (error) {
    throw error;
  }
};

// get user by id

const getUserById = async (id) => {
  const [rows] = await db.query(
    `
        SELECT
            id,
            name,
            email,
            phone,
            role,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
        `,
    [id],
  );

  return rows;
};

// update user by id

const updateUser = async (id, userData) => {
  const { name, email, phone, role } = userData;

  const [result] = await db.query(
    `
        UPDATE users
        SET
            name = ?,
            email = ?,
            phone = ?,
            role = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
    [name, email, phone, role, id],
  );

  return result;
};

/**
 * Find user by email
 */
const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query(
      "SELECT id, email FROM users WHERE email = ?",
      [email],
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

// get user by email except id

const getUserByEmailExceptId = async (email, id) => {
  const [rows] = await db.query(
    `
        SELECT *
        FROM users
        WHERE email = ?
        AND id != ?
        `,
    [email, id],
  );

  return rows;
};

/**
 * Find user by phone
 */
const getUserByPhone = async (phone) => {
  try {
    const [rows] = await db.query(
      "SELECT id, phone FROM users WHERE phone = ?",
      [phone],
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

//get user by phone except id
const getUserByPhoneExceptId = async (phone, id) => {
  const [rows] = await db.query(
    `
        SELECT *
        FROM users
        WHERE phone = ?
        AND id != ?
        `,
    [phone, id],
  );

  return rows;
};
/**
 * Create a new user
 */
const createUser = async (userData) => {
  try {
    const { name, email, phone, password, role } = userData;

    const [result] = await db.query(
      `
            INSERT INTO users
            (name, email, phone, password, role)
            VALUES (?, ?, ?, ?, ?)
            `,
      [name, email, phone, password, role],
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

// delete user by id

const deleteUser = async (id) => {
  const [result] = await db.query(
    `
        DELETE FROM users
        WHERE id = ?
        `,
    [id],
  );

  return result;
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserByPhone,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmailExceptId,
  getUserByPhoneExceptId,
};
