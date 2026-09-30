const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    image: {
      type: String, //cloudinary url
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: {
      type: Number,
      default: 0,
    },

    // Edit tracking
    isEdited: {
      type: Boolean,
      default: false,
    },
    lastEditedBy: {
      type: String,
      enum: ["owner", "admin", null],
      default: null,
    },

    // Soft delete (used when an admin deletes someone else's post, so the
    // author can still see a "Deleted by Admin" notice on their own profile)
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: String,
      enum: ["owner", "admin", null],
      default: null,
    },
  },
  { timestamps: true }
);

postSchema.virtual("likesCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Post", postSchema);
