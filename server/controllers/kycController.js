const kycModel = require("../models/kycModel");

// ===============================
// Upload KYC
// ===============================
const uploadKYC = async (req, res) => {
  try {
    const userId = req.user.id;

    const { aadhaar_number, dl_number } = req.body;

    // Validate Required Fields
    if (!aadhaar_number || !dl_number) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar Number and Driving License Number are required",
      });
    }

    // Validate Aadhaar Number
    if (!/^\d{12}$/.test(aadhaar_number)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number must be exactly 12 digits.",
      });
    }

    // Validate Driving License Number
    if (!/^[A-Za-z0-9]{8,30}$/.test(dl_number)) {
      return res.status(400).json({
        success: false,
        message:
          "Driving License number must be 8 to 30 alphanumeric characters.",
      });
    }

    // Validate Images
    if (!req.files || !req.files.aadhaar_image || !req.files.dl_image) {
      return res.status(400).json({
        success: false,
        message: "Both Aadhaar and Driving License images are required",
      });
    }

    // Check Existing KYC for User
    const existingUserKYC = await kycModel.checkKYCByUserId(userId);

    if (existingUserKYC.length > 0) {
      return res.status(400).json({
        success: false,
        message: "KYC already submitted.",
      });
    }

    // Check Duplicate Aadhaar / DL
    const duplicate = await kycModel.checkDuplicateKYC(
      aadhaar_number,
      dl_number,
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar Number or Driving License Number already exists.",
      });
    }

    // Image Paths
    const aadhaarImage = req.files.aadhaar_image[0].path;
    const dlImage = req.files.dl_image[0].path;

    // Save KYC
    await kycModel.createKYC(
      userId,
      aadhaar_number,
      dl_number,
      aadhaarImage,
      dlImage,
    );

    return res.status(201).json({
      success: true,
      message: "KYC submitted successfully. Waiting for admin verification.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// Get My KYC
// ===============================
const getMyKYC = async (req, res) => {
  try {
    const userId = req.user.id;

    const kyc = await kycModel.getKYCByUserId(userId);

    if (kyc.length === 0) {
      return res.status(404).json({
        success: false,
        message: "KYC not found",
      });
    }

    const data = kyc[0];

    data.aadhaar_number = "XXXXXXXX" + data.aadhaar_number.slice(-4);

    const stateCode = data.dl_number.slice(0, 2);
    const lastFour = data.dl_number.slice(-4);

    data.dl_number = `${stateCode}XXXXXXXX${lastFour}`;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// ===============================
// Get Pending KYC (Admin)
// ===============================
const getPendingKYC = async (req, res) => {
  try {
    const pendingKYC = await kycModel.getPendingKYC();

    return res.status(200).json({
      success: true,
      count: pendingKYC.length,
      data: pendingKYC,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// Verify KYC (Admin)
// ===============================
const verifyKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const verifiedBy = req.user.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Verification status is required",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either approved or rejected",
      });
    }

    const result = await kycModel.verifyKYC(
      id,
      status,
      remarks || null,
      verifiedBy,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "KYC record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `KYC ${status} successfully`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// Exports
// ===============================
module.exports = {
  uploadKYC,
  getMyKYC,
  getPendingKYC,
  verifyKYC,
};
