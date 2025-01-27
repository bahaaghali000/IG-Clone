const cloudinary = require("cloudinary").v2;
const Post = require("../models/post.model");
const PostLike = require("../models/postLikes.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const asyncErrorHandler = require("../utils/ErrorHandler");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");
const mongoose = require("mongoose");
const SavedPost = require("../models/savedPost.model");
const File = require("../models/file.model");
const Following = require("../models/following.model");
const Notification = require("../models/notification.model");
const { sendNotification } = require("../sockets/socket");

const newPost = asyncErrorHandler(async (req, res, next) => {
  const { caption } = req.body;

  // const uploadPromises = req.files.map((file) => {
  //   return new Promise((resolve, reject) => {
  //     cloudinary.uploader.upload(
  //       file.path,
  //       {
  //         transformation: [
  //           { width: 1000, crop: "scale" },
  //           { quality: "auto" },
  //           { fetch_format: "auto" },
  //         ],
  //         folder: "instagram_files",
  //       },
  //       (error, result) => {
  //         if (result) {
  //           // // Delete the file after uploading
  //           // fs.unlink(file.path, (err) => {
  //           //   if (err) console.error("Failed to delete file:", err);
  //           // });
  //           resolve(result.secure_url);
  //         } else {
  //           reject(error);
  //         }
  //       }
  //     );
  //   });
  // });

  let files = [];

  await req.files.map(async (file) => {
    await files.push(file.path);

    await File.create({
      fileName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    });
  });

  // const uploadedFiles = await Promise.all(uploadPromises);

  console.log(files);

  const postData = {
    caption,
    image: files,
    author: req.user._id,
  };

  const newPost = await Post.create(postData);

  res.status(201).json({
    status: "success",
    data: newPost,
  });
});

const allPosts = asyncErrorHandler(async (req, res, next) => {
  const pageSize = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;

  const postsAgg = await Post.aggregate([
    {
      $facet: {
        metadata: [{ $count: "total" }],
        posts: [
          {
            $lookup: {
              from: "users", // The collection name of the User model
              localField: "author",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    isPrivate: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                  },
                },
              ],
              as: "author",
            },
          },
          {
            $unwind: "$author",
          },
          // Step 2: Look up 'likes' to check if the user has liked the post
          {
            $lookup: {
              from: "postlikes", // The collection name of the PostLike model
              let: { postId: "$_id", userId: req.user._id },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$post", "$$postId"] },
                        { $eq: ["$likeMaker", "$$userId"] },
                      ],
                    },
                  },
                },
              ],
              as: "likes",
            },
          },

          // Step 3: the logged in user is following the user or not
          {
            $lookup: {
              from: "followings", // The collection name of the PostLike model
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        { user: req.user._id, following: "$_id" },
                        { user: "$_id", following: req.user._id },
                      ],
                    },
                  },
                },
              ],
              as: "hasFollowing",
            },
          },

          // Step 4: Add a new field 'hasLiked', 'hasFollowing'
          {
            $addFields: {
              hasLiked: { $gt: [{ $size: "$likes" }, 0] }, // If there are any likes from this user, hasLiked is true
              hasFollowing: { $gt: [{ $size: "$hasFollowing" }, 0] },
            },
          },
          {
            $match: {
              $or: [
                { "author.isPrivate": false },
                { hasFollowing: { $eq: true } },
              ],
              // "author.isPrivate": false,
            },
          },

          // Step 5: Pagination
          { $skip: skip },
          { $limit: pageSize },

          // Step 6: Project only the necessary fields
          {
            $project: {
              caption: 1,
              image: 1,
              author: { username: 1, fullname: 1, avatar: 1 },
              totalLikes: 1,
              hasLiked: 1,
              createdAt: 1,
              hasFollowing: 1,
            },
          },
        ],
      },
    },
  ]);

  const totalCount = postsAgg[0].metadata[0]?.total || 0;
  const posts = postsAgg[0].posts;

  res.status(200).json({
    status: "success",
    data: {
      posts,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      hasMore: page * pageSize < totalCount,
    },
  });
});

// const allPosts = asyncErrorHandler(async (req, res, next) => {
//   const pageSize = parseInt(req.query.limit) || 5;
//   const page = parseInt(req.query.page) || 1;
//   const skip = (page - 1) * pageSize;

//   const aggregationPipeline = [
//     // Step 1: Join with the 'users' collection to get author details
//     {
//       $lookup: {
//         from: "users",
//         localField: "author",
//         foreignField: "_id",
//         as: "author",
//       },
//     },
//     { $unwind: "$author" },

//     // Step 2: Check if the logged-in user has liked the post
//     {
//       $lookup: {
//         from: "postlikes",
//         let: { postId: "$_id", userId: req.user._id },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   { $eq: ["$post", "$$postId"] },
//                   { $eq: ["$likeMaker", "$$userId"] },
//                 ],
//               },
//             },
//           },
//         ],
//         as: "likes",
//       },
//     },

//     // Step 3: Check if the logged-in user is following the author
//     {
//       $lookup: {
//         from: "followings",
//         let: { authorId: "$author._id", userId: req.user._id },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $or: [
//                   {
//                     $eq: ["$user", "$$userId"],
//                     $eq: ["$following", "$$authorId"],
//                   },
//                   {
//                     $eq: ["$user", "$$authorId"],
//                     $eq: ["$following", "$$userId"],
//                   },
//                 ],
//               },
//             },
//           },
//         ],
//         as: "hasFollowing",
//       },
//     },

//     // Step 4: Check if the author is blocked by the logged-in user
//     {
//       $lookup: {
//         from: "blockedusers",
//         let: { authorId: "$author._id", userId: req.user._id },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   { $eq: ["$user", "$$userId"] },
//                   { $eq: ["$blocked", "$$authorId"] },
//                 ],
//               },
//             },
//           },
//         ],
//         as: "isBlocked",
//       },
//     },

//     // Step 5: Add computed fields
//     {
//       $addFields: {
//         hasLiked: { $gt: [{ $size: "$likes" }, 0] },
//         hasFollowing: { $gt: [{ $size: "$hasFollowing" }, 0] },
//         isBlocked: { $gt: [{ $size: "$isBlocked" }, 0] },
//       },
//     },

//     // Step 6: Filter out posts from blocked users and apply privacy settings
//     {
//       $match: {
//         isBlocked: false,
//         $or: [{ "author.isPrivate": false }, { hasFollowing: true }],
//       },
//     },

//     // Step 7: Use $facet to paginate and count in a single query
//     {
//       $facet: {
//         posts: [
//           { $skip: skip },
//           { $limit: pageSize },
//           {
//             $project: {
//               caption: 1,
//               image: 1,
//               author: { username: 1, fullname: 1, avatar: 1 },
//               totalLikes: 1,
//               hasLiked: 1,
//               createdAt: 1,
//               hasFollowing: 1,
//             },
//           },
//         ],
//         totalCount: [{ $count: "totalPosts" }],
//       },
//     },
//   ];

//   const [result] = await Post.aggregate(aggregationPipeline);

//   const posts = result.posts;
//   const totalCount = result.totalCount[0]?.totalPosts || 0;

//   res.status(200).json({
//     status: "success",
//     data: {
//       posts,
//       page,
//       pageSize,
//       totalPages: Math.ceil(totalCount / pageSize),
//       totalCount,
//       hasMore: page * pageSize < totalCount,
//     },
//   });
// });

const getPostDetails = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(postId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              isPrivate: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
              _id: 1,
            },
          },
        ],
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    // {
    //   $match: { "author.isPrivate": false },
    // },
    {
      $lookup: {
        from: "postlikes",
        let: { postId: "$_id", userId: req.user._id },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$post", "$$postId"] },
                  { $eq: ["$likeMaker", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "likes",
      },
    },

    {
      $lookup: {
        from: "followings",
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { user: req.user._id, following: "$_id" },
                  { user: "$_id", following: req.user._id },
                ],
              },
            },
          },
        ],
        as: "hasFollowing",
      },
    },

    {
      $addFields: {
        hasLiked: { $gt: [{ $size: "$likes" }, 0] },
        hasFollowing: { $gt: [{ $size: "$hasFollowing" }, 0] },
      },
    },
    {
      $match: {
        $or: [{ "author.isPrivate": false }, { hasFollowing: { $eq: true } }],
        // "author.isPrivate": false,
      },
    },
    {
      $project: {
        caption: 1,
        image: 1,
        author: { username: 1, fullname: 1, avatar: 1 },
        totalLikes: 1,
        hasLiked: 1,
        createdAt: 1,
        hasFollowing: 1,
      },
    },
  ]);

  if (!post || post.length === 0)
    return next(new AppError("Post not found", 404));

  res.status(200).json({
    success: true,
    data: { post: post[0] },
  });
});

const likeOrUnlikePost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError("Post not found", 404));

  const liked = await PostLike.findOneAndDelete({
    post: postId,
    likeMaker: req.user._id,
  });

  if (liked)
    return res.status(200).json({ success: true, message: "Post Unliked" });

  // like the psot
  await PostLike.create({
    post: postId,
    likeMaker: req.user._id,
  });

  const notification = await Notification.create({
    type: "LIKE",
    user: post.author._id,
    content: `${req.user.username} Likes Your Post`,
    post: postId,
  });

  sendNotification(
    { ...notification.toObject(), user: post.author, post: post },
    post.author._id.toString()
  );

  return res.status(200).json({ success: true, message: "Post Liked" });
});

const saveOrUnsavePost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError("Post not found", 404));

  const saved = await SavedPost.findOneAndDelete({
    user: req.user._id,
    saved: post._id,
  });

  if (saved) {
    // unsave the post
    return res
      .status(200)
      .json({ status: "success", message: "Post Unsaved successfully" });
  } else {
    // save the post

    await SavedPost.create({
      user: req.user._id,
      saved: post._id,
    });

    return res
      .status(200)
      .json({ status: "success", message: "Post Saved successfully" });
  }
});

const updateCaption = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { caption } = req.body;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError("Post not found", 404));

  if (post.author.toString() === req.user._id.toString()) {
    // Update the caption if I'm the author of the post

    post.caption = caption;
    await post.save();

    return res.status(200).json({ status: "success", message: "Post Updated" });
  } else return next(new AppError("Unauthorized", 401));
});

const deletePost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError("Post not found", 404));

  if (post.author.toString() === req.user._id.toString()) {
    // delete only if I'm the author of the post

    await Promise.all([
      post.deleteOne(),

      // delete all post likes
      PostLike.deleteMany({
        post: post._id,
      }),

      // delete all saved post
      SavedPost.deleteMany({
        saved: post._id,
      }),
    ]);

    return res
      .status(200)
      .json({ status: "success", message: "Post deleted successfully" });
  } else return next(new AppError("Unauthorized", 401));
});

const newComment = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const { comment } = req.body;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError("Post not found", 404));

  const newComment = await Comment.create({
    postId,
    author: req.user._id,
    comment,
  });

  res.status(201).json({
    status: "success",
    message: "Comment created successfully",
    data: {
      ...newComment.toJSON(),
      author: {
        avatar: req.user.avatar,
        fullname: req.user.fullname,
        username: req.user.username,
        _id: req.user._id,
      },
    },
  });
});

const likeOrUnlikeComment = asyncErrorHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) return next(new AppError("Comment not found", 404));

  if (comment.likes.includes(req.user._id)) {
    // unlike the comment
    const index = comment.likes.indexOf(req.user._id);
    comment.likes.splice(index, 1);

    await comment.save();

    return res
      .status(200)
      .json({ status: "success", message: "Comment Unliked successfully" });
  } else {
    // Like the comment
    comment.likes.push(req.user._id);
    await comment.save();

    return res
      .status(200)
      .json({ status: "success", message: "Comment Liked successfully" });
  }
});

const getPostsOfFollowing = asyncErrorHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.offset) || 1;

  const following = req.user.following;
  const posts = await Post.find({ author: { $in: following } })
    .populate({
      path: "author",
      select: "avatar username fullname",
    })
    .limit(limit)
    .skip(page - 0 * limit);
  //  .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: posts,
  });
});

const getCommentsOfPost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;

  const comments = await Comment.find({ postId })
    .populate({
      path: "author",
      select: "username fullname avatar _id",
    })
    .limit(limit)
    .skip((page - 1) * limit);
  // .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: comments,
  });
});

module.exports = {
  newPost,
  allPosts,
  getPostDetails,
  likeOrUnlikePost,
  saveOrUnsavePost,
  updateCaption,
  deletePost,
  newComment,
  likeOrUnlikeComment,
  getPostsOfFollowing,
  getCommentsOfPost,
};
