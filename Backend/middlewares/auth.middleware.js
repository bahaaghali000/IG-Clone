const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncErrorHandler = require("../utils/ErrorHandler");

const isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Please Login First",
    });
  }

  const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedData.id).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "Invalid Token" });
  }

  req.user = user;

  next();
});

module.exports = isAuthenticated;
