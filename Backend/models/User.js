const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9_.]+$/, "Username can only contain lowercase letters, numbers, dots and underscores"],
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    profilePicturePublicId: {
      type: String,
      default: "",
    },

    // Roles
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Account status
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Never send sensitive fields to the client
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    username: this.username,
    displayName: this.displayName,
    email: this.email,
    bio: this.bio,
    profilePicture: this.profilePicture,
    role: this.role,
    isBanned: this.isBanned,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
