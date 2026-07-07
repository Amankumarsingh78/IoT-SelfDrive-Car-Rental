const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

/**
 * GET /api/users
 * Fetch all users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * POST /api/users
 * Create a new user
 */
const createUser = async (req, res) => {
  try {
    const userData = { ...req.body };

    // Validate required fields
    const { name, email, phone, password, role } = userData;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check if phone already exists
    const existingPhone = await userModel.getUserByPhone(phone);

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);

    const result = await userModel.createUser(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // MySQL duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry found.",
      });
    }

    // MySQL validation/data error
    if (error.code === "WARN_DATA_TRUNCATED") {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided.",
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//get user by id (search by id)

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await userModel.getUserById(id);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//update user by id (search by id)

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    // Required field validation
    if (!name || !email || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const existingUser = await userModel.getUserById(id);

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check duplicate email
    const emailExists = await userModel.getUserByEmailExceptId(email, id);

    if (emailExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check duplicate phone
    const phoneExists = await userModel.getUserByPhoneExceptId(phone, id);

    if (phoneExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // Update user
    await userModel.updateUser(id, {
      name,
      email,
      phone,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//delete user by id (search by id)

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await userModel.getUserById(id);

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await userModel.deleteUser(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,

  getUserById,
  updateUser,
  deleteUser,
};
