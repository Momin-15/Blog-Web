const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
    register,
    login,
    logout,
    getMe,
} = require("../controllers/authController");
const { protect } = require("../Middleware/Auth");
const validate = require("../Middleware/validate");

router.post(
    "/register",
    [
        body("username")
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage("Username must be 3-30 characters")
            .matches(/^[a-zA-Z0-9_.]+$/)
            .withMessage("Username can only contain letters, numbers, dots and underscores"),
        body("displayName").trim().notEmpty().withMessage("Display name is required"),
        body("email").isEmail().withMessage("A valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    validate,
    register
);

router.post(
    "/login",
    [body("email").isEmail(), body("password").notEmpty()],
    validate,
    login
);

router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
