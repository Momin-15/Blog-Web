const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");
const cloudinary = require("../config/cloudinary");

// Profile image storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog_profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Post image storage
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog_posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Profile image upload
const uploadProfileImage = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Post image upload
const uploadPostImage = multer({
  storage: postStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadPostImage,
  uploadProfileImage,
};

