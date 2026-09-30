const passport = require("passport");
const { Strategy: JwtStrategy } = require("passport-jwt");
const User = require("../models/User");

// Extract JWT from httpOnly cookie
const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies[
      process.env.JWT_COOKIE_NAME || "blog_token"
    ];
  }

  return null;
};

// JWT Authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);

        if (!user) {
          return done(null, false);
        }

        if (user.isBanned) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = passport;
