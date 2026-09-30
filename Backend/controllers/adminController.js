const User = require("../models/User");
const Post = require("../models/Post");


// GET ALL USERS
const listUsers = async (req, res, next) => {
  try {
    const search = req.query.q || "";

    const users = await User.find({
      username: { $regex: search, $options: "i" },
    })
      .select(
        "username displayName email role isBanned createdAt"
      )
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    next(error);
  }
};


// BAN / UNBAN USER
const toggleBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBanned = !user.isBanned;

    await user.save();

    res.json({
      message: user.isBanned
        ? "User banned"
        : "User unbanned",
      isBanned: user.isBanned,
    });
  } catch (error) {
    next(error);
  }
};


// DELETE USER
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete user's posts
    await Post.deleteMany({
      author: user._id,
    });

    // Delete user
    await user.deleteOne();

    res.json({
      message: "User and their posts deleted",
    });
  } catch (error) {
    next(error);
  }
};


// GET ALL POSTS
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate(
        "author",
        "username displayName profilePicture"
      );

    res.json({ posts });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  listUsers,
  toggleBanUser,
  deleteUser,
  getAllPosts,
};
