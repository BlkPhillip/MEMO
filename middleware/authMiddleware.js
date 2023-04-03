const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ErrorResponse = require("./errorResponse");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check jwt exist & verified
  if (token) {
    jwt.verify(token, "secret token", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "secret token", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        req.user = await User.findById(decodedToken.id);
        res.locals.user = req.user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const authRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // return next(
      //   new ErrorResponse(
      //     `User role ${req.user.role} is not authorized to access this route`,
      //     403
      //   )
      // );
      res.redirect("/login");
    } else {
      next();
    }
  };
};

module.exports = { requireAuth, checkUser, authRole };
