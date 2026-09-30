const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie(process.env.JWT_COOKIE_NAME || "blog_token", token, {
    httpOnly: true,
    secure: isProd, 
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  return token;
};

const clearTokenCookie = (res) => {
  res.clearCookie(process.env.JWT_COOKIE_NAME || "blog_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};

module.exports = { generateTokenAndSetCookie, clearTokenCookie };
