const User = require("../models/user.model");
const Post = require("../models/post.model");
const asyncErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/AppError");
const Apifeatures = require("../utils/APIFeatures");
const Following = require("../models/following.model");
const jwt = require("jsonwebtoken");
const BlockedUser = require("../models/blockedUser.model");
const { sendNotification } = require("../sockets/socket");
const Notification = require("../models/notification.model");

const getUser = asyncErrorHandler(async (req, res, next) => {
  console.log(req);
  console.log(req.get("Accept-Language"));
  console.log(req.acceptsLanguages("en-US"));
  const user = await User.findOne({ username: req.params.username }).select(
    "username fullname bio avatar"
  );

  if (!user) return next(new AppError("User Not Found", 404));

  const totalPostsCount = await Post.countDocuments({ author: user._id });

  const totalFollowingCount = await Following.countDocuments({
    user: user._id,
  });

  const totalFollowersCount = await Following.countDocuments({
    following: user._id,
  });

  // the logged in user is following the user or not
  const isFollowed = await Following.findOne({
    $or: [
      { user: req?.user?._id, following: user._id },
      { user: user._id, following: req?.user?._id },
    ],
  });

  res.json({
    status: "success",
    data: {
      user,
      totalPostsCount,
      totalFollowingCount,
      totalFollowersCount,
      isFollowed: isFollowed ? true : false,
    },
  });
});

const getUserById = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "username email avatar fullname isPrivate"
  );

  if (!user) return next(new AppError("User Not Found", 404));

  res.json({ status: "success", data: user });
});

const getPostsOfUser = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  const user = await User.findOne({
    username: req.params.username,
  });

  let me;

  if (!user) return next(new AppError("username doesn't exsit", 404));

  if (token) {
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    me = await User.findById(decodedData.id).select("_id");
  }

  if (user.isPrivate && me._id.toString() !== user._id.toString())
    return next(new AppError("user is private", 404));

  const posts = await Post.find({ author: user._id });

  // const posts = await Post.aggregate([
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "author",
  //       foreignField: "_id",
  //       as: "author",
  //     },
  //   },
  //   {
  //     $unwind: "$author",
  //   },
  //   {
  //     $match: { "author.isPrivate": false },
  //   },
  // ]);

  res.status(200).json({ success: true, data: posts });
});

const getAllUsers = asyncErrorHandler(async (req, res) => {
  const search = [
    {
      fullname: {
        $regex: req.query.search,
        $options: "i",
      },
    },
    {
      username: {
        $regex: req.query.search,
        $options: "i",
      },
    },
    {
      email: {
        $regex: req.query.search,
        $options: "i",
      },
    },
  ];

  const features = new Apifeatures(
    User.find().select("username fullname email bio avatar isPrivate"),
    req.query
  )
    .sort()
    .filter(search)
    .limitFields()
    .paginate();

  const users = await features.query;

  res.json({
    success: true,
    data: users,
  });
});

const getSuggestUsers = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  const followings = await Following.find({
    user: userId,
  }).select("_id");

  const blockeds = await BlockedUser.find({
    user: userId,
  });

  const followingIds = followings.map((fl) => fl._id.toString());

  const features = new Apifeatures(
    User.find({
      _id: {
        $ne: userId, // Exclude the logged-in user
        $nin: followingIds.concat(blockeds), // Exclude users the logged-in user is following or has blocked
      },
    }).select("username fullname avatar"),
    req.query
  );

  const suggestedUsers = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      suggestedUsers,
    },
  });
});

const followOrUnfollow = asyncErrorHandler(async (req, res, next) => {
  const userToFollow = await User.findOne({ username: req.params.username });

  if (!userToFollow) return next(new AppError("User not found", 404));

  const isFollowing = await Following.findOneAndDelete({
    user: req.user._id,
    following: userToFollow._id,
  });

  if (isFollowing) {
    // unfolow the user

    return res.status(200).json({
      success: true,
      message: "User Unfollowed successfully",
    });
  } else {
    // folow the user

    await Following.create({
      user: req.user._id,
      following: userToFollow._id,
    });

    const notification = await Notification.create({
      user: userToFollow._id,
      type: "FOLLOW",
      content: `${req.user.username} started following you`,
    });

    sendNotification(
      { ...notification.toObject(), user: userToFollow },
      userToFollow._id.toString()
    );

    return res.status(200).json({
      success: true,
      message: "User Followed successfully",
    });
  }
});

const getProfile = asyncErrorHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .populate({
      path: "posts",
      populate: {
        path: "author",
      },
    })
    .populate({
      path: "saved",
      populate: {
        path: "savedBy",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "comments",
        populate: {
          path: "user",
        },
      },
    });
});

const updateProfilePicture = asyncErrorHandler(async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    transformation: [
      { width: 1000, crop: "scale" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
    folder: "instagram_profile_pictures",
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true } // Good Info
  );

  res.status(200).json({
    success: true,
    message: "Profile Picture updated successfully",
    url: result.secure_url,
    data: user,
  });
});

const updateProfileDetails = asyncErrorHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

const deleteProfile = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("posts");
  const followers = await Following.find({ following: user._id });

  await user.remove();

  for (let i = 0; i < user.posts.length; i++) {
    await Post.findByIdAndDelete(user.posts[i]._id);
  }

  for (let i = 0; i < followers.length; i++) {
    await User.findByIdAndDelete(followers[i]._id);
  }

  res.status(200).json({
    success: true,
    message: "Profile Deleted Successfully",
  });
});

const getFollowersOfUser = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  const user = await User.findOne({
    username: req.params.username,
  });

  let me;

  if (!user) return next(new AppError("username doesn't exsit", 404));

  if (token) {
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    me = await User.findById(decodedData.id).select("_id");
  }

  if (user.isPrivate && me._id.toString() !== user._id.toString())
    return next(new AppError("user is private", 404));

  const followers = await Following.find({
    following: user._id,
  }).populate({
    path: "user",
    select: "username fullname email avatar",
  });

  res.status(200).json({
    success: true,
    data: followers.map((follower) => follower.user),
  });
});

const getFollowingsOfUser = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  const user = await User.findOne({
    username: req.params.username,
  });

  let me;

  if (!user) return next(new AppError("username doesn't exsit", 404));

  if (token) {
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    me = await User.findById(decodedData.id).select("_id");
  }

  if (user.isPrivate && me._id.toString() !== user._id.toString())
    return next(new AppError("user is private", 404));

  const followings = await Following.find({
    user: user._id,
  }).populate({
    path: "following",
    select: "username fullname email avatar",
  });

  res.status(200).json({
    success: true,
    data: followings.map((following) => following.following),
  });
});

module.exports = {
  getUser,
  getAllUsers,
  followOrUnfollow,
  getProfile,
  getPostsOfUser,
  deleteProfile,
  getUserById,
  getSuggestUsers,
  updateProfilePicture,
  updateProfileDetails,
  getFollowersOfUser,
  getFollowingsOfUser,
};
