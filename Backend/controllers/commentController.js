const Comment = require("../models/Comment");
const Post = require("../models/Post");


// ADD COMMENT
const addComment = async (req, res, next) => {
  try {
    const text = req.body.text;

    // Check comment
    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    // Check post
    const post = await Post.findById(req.params.postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      post: post._id,
      user: req.user._id,
      text: text.trim(),
    });

    // Get user information with comment
    await comment.populate(
      "user",
      "username displayName profilePicture"
    );

    res.status(201).json({
      comment,
    });
  } catch (error) {
    next(error);
  }
};


// GET COMMENTS
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .sort({ createdAt: 1 })
      .populate(
        "user",
        "username displayName profilePicture"
      );

    res.json({
      comments,
    });
  } catch (error) {
    next(error);
  }
};


// DELETE COMMENT 
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Check if user owns the comment
    const isCommentOwner =
      String(comment.user) === String(req.user._id);

    // Check if user is admin
    const isAdmin = req.user.email === "momin@blogadmin.com";

    if (!isCommentOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can't delete this comment",
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  addComment,
  getComments,
  deleteComment,
};
