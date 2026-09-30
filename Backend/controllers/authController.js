const User = require("../models/User");

const {
  generateTokenAndSetCookie,
  clearTokenCookie,
} = require("../utils/generateToken");

const ADMIN_EMAIL = "momin@blogadmin.com";


// REGISTER
const register = async (req, res, next) => {
  try {
    const { username, displayName, email, password } = req.body;

    const userEmail = email.toLowerCase().trim();
    const userUsername = username.toLowerCase().trim();

    // Check email
    const emailExists = await User.findOne({ email: userEmail });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Check username
    const usernameExists = await User.findOne({
      username: userUsername,
    });

    if (usernameExists) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    const isAdmin = userEmail === ADMIN_EMAIL;

    const user = new User({
      username: userUsername,
      displayName,
      email: userEmail,
      password,
      role: isAdmin ? "admin" : "user",
    });

    await user.save();

    res.status(201).json({
      message: "Account created. You can now log in.",
      isAdminSignup: isAdmin,
    });
  } catch (error) {
    next(error);
  }
};


// LOGIN
const login = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordCorrect = await user.comparePassword(password);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        message: "Account is banned",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    res.json({
      message: "Login successful",
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};


// LOGOUT
const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({
    message: "Logged out",
  });
};


// GET CURRENT USER
const getMe = (req, res) => {
  res.json({
    user: req.user.toSafeObject(),
  });
};


module.exports = {
  register,
  login,
  logout,
  getMe,
};
