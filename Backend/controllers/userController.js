const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

// SEARCH USERS
const searchUsers = async (req, res, next) => {
  try {
    const search = req.query.q || "";

    if (!search.trim()) {
      return res.json({
        users: [],
      });
    }

    const users = await User.find({
      username: {
        $regex: search,
        $options: "i",
      },
      isBanned: false,
    })
      .select(
        "username displayName profilePicture bio"
      )
      .limit(20);

    res.json({
      users,
    });
  } catch (error) {
    next(error);
  }
};

// GET USER PROFILE
const getProfile = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase();

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isOwner =
      req.user &&
      String(req.user._id) === String(user._id);

    // Owner can see deleted posts
    // Other users can only see active posts
    let filter = {
      author: user._id,
    };

    if (!isOwner) {
      filter.isDeleted = false;
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate(
        "author",
        "username displayName profilePicture"
      );

    res.json({
      user: {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        role: user.role,
        createdAt: user.createdAt,
      },

      isOwner,

      posts,

      postCount: posts.filter(
        (post) => !post.isDeleted
      ).length,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE MY PROFILE
const updateMyProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (req.body.displayName !== undefined) {
      user.displayName = req.body.displayName;
    }

    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    if (req.file) {
      // Save old public ID
      const previousPublicId =
        user.profilePicturePublicId;

      // CloudinaryStorage already uploaded the image
      user.profilePicture = req.file.path;
      user.profilePicturePublicId =
        req.file.filename;

      await user.save();

      // Delete previous profile image
      if (
        previousPublicId &&
        previousPublicId !== req.file.filename
      ) {
        await cloudinary.uploader.destroy(
          previousPublicId
        );
      }
    } else {
      await user.save();
    }

    res.json({
      message: "Profile updated",
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchUsers,
  getProfile,
  updateMyProfile,
};