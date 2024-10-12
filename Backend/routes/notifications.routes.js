const express = require("express");
const isAuthenticated = require("../middlewares/auth.middleware");
const Notification = require("../models/notification.model");

const router = express.Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  console.log("called");
  // Fetch notifications from database and send them to the user
  const notifications = await Notification.find({
    user: req.user._id,
  })
    .sort("-createdAt")
    .populate({
      path: "user",
      select: "username avatar fullname _id",
    })
    .populate({
      path: "post",
      select: "caption image _id ",
    });

  console.log(notifications);

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

module.exports = router;
