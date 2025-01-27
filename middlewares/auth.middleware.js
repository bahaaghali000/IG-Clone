const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncErrorHandler = require("../utils/ErrorHandler");
const AppError = require("../utils/AppError");

const isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Please Login First",
    });
  }

  const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedData.id).select("+passwordChangedAt");

  if (!user) {
    return next(new AppError("user not found", 401));
    // return res.status(404).json({ success: false, message: "Invalid Token" });
  }

  if (
    user.passwordChangedAt &&
    new Date(user.passwordChangedAt).getTime() / 1000 > decodedData.iat
  ) {
    return next(
      new AppError(
        "Your password has recently been changed. Please log in again.",
        401
      )
    );
  }

  req.user = {
    _id: user._id,
    isPrivate: user.isPrivate,
    email: user.email,
    username: user.username
  };

  next();
});

module.exports = isAuthenticated;
