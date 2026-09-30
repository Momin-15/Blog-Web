const express = require("express");
const router = express.Router();

const {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
} = require("../controllers/postController");
const { addComment, getComments, deleteComment } = require("../controllers/commentController");
const { protect, optionalAuth } = require("../Middleware/Auth");
const { uploadPostImage } = require("../Middleware/upload");

router.get("/", getFeed);
router.post(
  "/",
  protect,
  uploadPostImage.single("image"),
  createPost
);

router.get("/:id", optionalAuth, getPostById);
router.put("/:id", protect, uploadPostImage.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

router.post("/:id/like", protect, toggleLike);

// Comments nested under posts
router.get("/:postId/comments", getComments);
router.post("/:postId/comments", protect, addComment);

module.exports = router;
