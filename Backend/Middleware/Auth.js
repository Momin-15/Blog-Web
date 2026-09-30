const passport = require("passport");
const ADMIN_EMAIL = "momin@blogadmin.com";

// Requires a valid JWT (from httpOnly cookie). Attaches req.user.
const protect = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated. Please log in." });
    }

    req.user = user;
    next();
  })(req, res, next);
};

const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
};

const requireAdmin = (req, res, next) => {
  if (req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: "Admin access required." });
  } 
  next();
};


module.exports = { protect, optionalAuth, requireAdmin };
