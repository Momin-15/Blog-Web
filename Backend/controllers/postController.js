const Post = require("../models/Post");
const Comment = require("../models/Comment");
const cloudinary = require("../config/cloudinary");

const authorFields = "username displayName profilePicture role";

// CREATE POST
const createPost = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // CloudinaryStorage already uploaded the image
    const imageUrl = req.file?.path || "";
    const imagePublicId = req.file?.filename || "";

    const post = await Post.create({
      title,
      description,
      image: imageUrl,
      imagePublicId: imagePublicId,
      author: req.user._id,
    });

    await post.populate("author", authorFields);

    res.status(201).json({
      message: "Post published",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL POSTS
const getFeed = async (req, res, next) => {
  try {
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      parseInt(req.query.limit) || 10,
      30
    );

    const skip = (page - 1) * limit;

    const posts = await Post.find({
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", authorFields);

    const total = await Post.countDocuments({
      isDeleted: false,
    });

    res.json({
      posts,
      page,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE POST
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", authorFields);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isOwner =
      req.user &&
      String(req.user._id) === String(post.author._id);

    const isAdmin = req.user?.role === "admin";

    if (post.isDeleted && !isOwner && !isAdmin) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Don't count author's own views
    if (!isOwner) {
      post.views += 1;
      await post.save();
    }

    const comments = await Comment.find({
      post: post._id,
    })
      .sort({ createdAt: 1 })
      .populate(
        "user",
        "username displayName profilePicture"
      );

    const likedByMe =
      req.user &&
      post.likes.some(
        (id) => String(id) === String(req.user._id)
      );

    res.json({
      post,
      comments,
      isOwner,
      likedByMe,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE POST
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        message: "Post not found..",
      });
    }

    const isOwner =
      String(post.author) === String(req.user._id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can only edit your own posts",
      });
    }

    if (req.body.title !== undefined) {
      post.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      post.description = req.body.description;
    }

    let previousImagePublicId;

    if (req.file) {
      // Save old public ID before replacing it
      previousImagePublicId = post.imagePublicId;

      // CloudinaryStorage already uploaded the new image
      post.image = req.file.path;
      post.imagePublicId = req.file.filename;
    }

    post.isEdited = true;
    post.lastEditedBy = isOwner ? "owner" : "admin";

    await post.save();

    // Delete old image from Cloudinary
    if (previousImagePublicId) {
      await cloudinary.uploader.destroy(
        previousImagePublicId
      );
    }

    await post.populate("author", authorFields);

    res.json({
      message: "Post updated",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE POST
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isOwner =
      String(post.author) === String(req.user._id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }

    // Owner permanently deletes post
    if (isOwner) {
      await Comment.deleteMany({
        post: post._id,
      });

      await post.deleteOne();

      // Delete image from Cloudinary
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(
          post.imagePublicId
        );
      }

      return res.json({
        message: "Post deleted",
      });
    }

    // Admin soft deletes post
    post.isDeleted = true;
    post.deletedBy = "admin";

    await post.save();

    res.json({
      message: "Post removed by admin",
    });
  } catch (error) {
    next(error);
  }
};

// LIKE / UNLIKE POST
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = String(req.user._id);

    const alreadyLiked = post.likes.some(
      (id) => String(id) === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => String(id) !== userId
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      likesCount: post.likes.length,
      likedByMe: !alreadyLiked,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
};