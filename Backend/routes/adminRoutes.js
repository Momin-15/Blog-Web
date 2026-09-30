const express = require("express");

const router = express.Router();

const {
  listUsers,
  toggleBanUser,
  deleteUser,
  getAllPosts,
} = require("../controllers/adminController");

const { protect, requireAdmin } = require("../Middleware/Auth");

// 2. User must be logged in and have the admin role
router.use(protect);
router.use(requireAdmin);


// Get all users
router.get("/users", listUsers);

// Ban or unban a user
router.put("/users/:id/ban", toggleBanUser);

// Delete a user
router.delete("/users/:id", deleteUser);

// Get all posts
router.get("/posts", getAllPosts);


module.exports = router;