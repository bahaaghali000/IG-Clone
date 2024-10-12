const File = require("../models/file.model");
const Following = require("../models/following.model");
const Story = require("../models/story.model");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const asyncErrorHandler = require("../utils/ErrorHandler");

const createStory = asyncErrorHandler(async (req, res, next) => {
  const file = await File.create({
    fileName: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });

  const story = await Story.create({
    owner: req.user._id,
    image: file.path,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      story,
    },
  });
});

const getStoriesOfUser = asyncErrorHandler(async (req, res, next) => {
  // make sure the user is not PRIVATE

  const user = await User.findById(req.params.userId).select("isPrivate");

  if (user.isPrivate && req.user._id !== user._id)
    return next(new AppError("The User is Prviate"));

  const stories = await Story.find({
    owner: req.params.userId,
    expiresAt: { $gt: Date.now() },
  }).populate({
    path: "owner",
    select: "avatar username fullname",
  });

  return res.status(200).json({ success: true, data: { stories } });
});

const deleteStory = asyncErrorHandler(async (req, res, next) => {
  const story = await Story.findOneAndDelete({
    _id: req.params.storyId,
    owner: req.user._id,
  });

  if (!story)
    return next(
      new AppError("Couldn't find story or this permission for owner only")
    );

  return res
    .status(200)
    .json({ success: true, message: "Story deleted successfully" });
});

const getStoriesOfFollowingUsers = asyncErrorHandler(async (req, res, next) => {
  const followingUsers = await Following.find({
    user: req.user._id,
  }).select("following");

  const stories = await Story.find({
    owner: { $in: followingUsers.map((u) => u.following) },
    expiresAt: { $gt: Date.now() },
  }).populate({
    path: "owner",
    select: "avatar username fullname",
  });

  res.status(200).json({ success: true, data: stories });
});

module.exports = {
  createStory,
  getStoriesOfUser,
  deleteStory,
  getStoriesOfFollowingUsers,
};
