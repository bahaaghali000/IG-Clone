const User = require("../models/user.model");
const Post = require("../models/post.model");
const asyncErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/AppError");
const Following = require("../models/following.model");
const jwt = require("jsonwebtoken");
const { sendNotification } = require("../sockets/socket");
const Notification = require("../models/notification.model");

const getUser = asyncErrorHandler(async (req, res, next) => {
  console.log(req.get("Accept-Language"));
  // console.log(req.acceptsLanguages("en-US"));

  const userAgg = await User.aggregate([
    // Stage 1: Match the user by username
    {
      $match: {
        username: req.params.username,
      },
    },
    // Stage 2: Lookup posts to count total posts
    {
      $lookup: {
        from: "posts", // Collection name for posts
        localField: "_id",
        foreignField: "author",
        as: "posts",
      },
    },
    // Stage 3: Lookup followers to count total followers
    {
      $lookup: {
        from: "followings", // Collection name for followings
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    // Stage 4: Lookup followings to count total followings
    {
      $lookup: {
        from: "followings", // Collection name for followings
        localField: "_id",
        foreignField: "user",
        as: "followings",
      },
    },
    // Stage 5: Check if the logged-in user is following this user
    {
      $lookup: {
        from: "followings", // Collection name for followings
        let: { userId: "$_id", loggedInUserId: req.user?._id },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $and: [
                      { $eq: ["$user", "$$loggedInUserId"] },
                      { $eq: ["$following", "$$userId"] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$following", "$$loggedInUserId"] },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "isFollowed",
      },
    },
    // Stage 6: Project the required fields
    {
      $project: {
        username: 1,
        fullname: 1,
        bio: 1,
        avatar: 1,
        totalPostsCount: { $size: "$posts" }, // Count total posts
        totalFollowersCount: { $size: "$followers" }, // Count total followers
        totalFollowingCount: { $size: "$followings" }, // Count total followings
        isFollowed: { $gt: [{ $size: "$isFollowed" }, 0] }, // Check if followed
      },
    },
  ]);

  // If no user is found, return a 404 error
  if (userAgg.length === 0) {
    return next(new AppError("User Not Found", 404));
  }

  res.json({
    status: "success",
    data: {
      user: userAgg[0],
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
  const searchTerm = req.query.search;

  // Define the search query
  const searchQuery = searchTerm
    ? {
        $or: [
          { username: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : {};

  const pageSize = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;

  const usersAgg = await User.aggregate([
    {
      $match: searchQuery,
    },
    {
      $facet: {
        metadata: [{ $count: "total" }], // Count total matching documents
        data: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              email: 1,
              bio: 1,
              avatar: 1,
              isPrivate: 1,
            },
          },
          { $skip: skip },
          { $limit: pageSize },
        ],
      },
    },
  ]);

  const totalCount = usersAgg[0].metadata[0]?.total || 0;
  const users = usersAgg[0].data;

  res.json({
    success: true,
    data: {
      users,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      hasMore: page * pageSize < totalCount,
    },
  });
});

const getSuggestUsers = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  const pageSize = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;

  const suggestedUsersAgg = await User.aggregate([
    {
      $match: {
        _id: { $ne: userId },
      },
    },
    {
      $lookup: {
        from: "followings",
        localField: "_id",
        foreignField: "user",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "blockedusers", // Assuming the collection name is "blockedusers"
        localField: "_id",
        foreignField: "user",
        as: "blockeds",
      },
    },
    {
      $addFields: {
        isFollowed: { $in: [userId, "$followings.user"] },
        isBlocked: { $in: [userId, "$blockeds.user"] },
      },
    },
    {
      $match: {
        isFollowed: false,
        isBlocked: false,
      },
    },
    {
      $facet: {
        // Pipeline for counting the total number of suggested users
        totalCount: [{ $count: "count" }],
        // Pipeline for paginated results
        suggestedUsers: [
          { $skip: skip },
          { $limit: pageSize },
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$totalCount", // Unwind the totalCount array to access the count value
    },
    {
      $project: {
        suggestedUsers: 1,
        totalCount: "$totalCount.count", // Extract the count value
      },
    },
  ]);

  console.log();

  // Extract the results from the aggregation
  const result = suggestedUsersAgg[0];
  const suggestedUsers = result.suggestedUsers;
  const totalCount = result.totalCount || 0; // Default to 0 if no results

  res.status(200).json({
    status: "success",
    data: {
      suggestedUsers,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      hasMore: page * pageSize < totalCount,
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
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
