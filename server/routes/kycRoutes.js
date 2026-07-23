const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

const kycController = require("../controllers/kycController");

// ===============================
// User Routes
// ===============================

// Upload KYC
router.post(
  "/upload",
  authenticate,
  upload.fields([
    {
      name: "aadhaar_image",
      maxCount: 1,
    },
    {
      name: "dl_image",
      maxCount: 1,
    },
  ]),
  kycController.uploadKYC,
);

// Get My KYC
router.get("/my", authenticate, kycController.getMyKYC);

// ===============================
// Admin Routes
// ===============================

// Get Pending KYC
router.get(
  "/pending",
  authenticate,
  authorize("admin"),
  kycController.getPendingKYC,
);

// Verify KYC
router.put(
  "/:id/verify",
  authenticate,
  authorize("admin"),
  kycController.verifyKYC,
);

module.exports = router;
