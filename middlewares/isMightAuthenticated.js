const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncErrorHandler = require("../utils/ErrorHandler");

const isMightAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedData.id);

    req.user = user;
  }

  next();
});

module.exports = isMightAuthenticated;
