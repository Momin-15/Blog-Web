const express = require("express");
const router = express.Router();

const { searchUsers, getProfile, updateMyProfile } = require("../controllers/userController");
const { protect, optionalAuth } = require("../Middleware/Auth");
const { uploadProfileImage } = require("../Middleware/upload");

router.get("/search", searchUsers);
router.get("/:username", optionalAuth, getProfile);
router.put("/me", protect, uploadProfileImage.single("profilePicture"), updateMyProfile);

module.exports = router;
