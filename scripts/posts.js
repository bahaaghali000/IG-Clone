const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const PostLike = require("../models/postLikes.model");
const CommentLike = require("../models/commentLikes.model");
const Comment = require("../models/comment.model");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/instagram");

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error(err));

(async () => {
  try {
    const users = await User.find({});
    // const posts = await Post.find({});
    const comments = await Comment.find({});

    // const images = [
    //   "uploads\\1726863205673-firmbee-com-gcsNOsPEXfs-unsplash.jpg",
    //   "uploads\\1726863205695-marvin-meyer-SYTO3xs06fU-unsplash.jpg",
    //   "uploads\\1726863205831-thought-catalog-505eectW54k-unsplash.jpg",
    // ];

    // for (let i = 0; i < 16020; i++) {
    //   const user = users[Math.floor(Math.random() * users.length)];

    //   const post = {
    //     caption: `${user.fullname} created a post`,
    //     image: [images[Math.floor(Math.random() * images.length)]],
    //     author: user._id,
    //   };

    //   await Post.create(post);
    // }

    // Seed Comments
    // for (let i = 0; i < 10000; i++) {
    //   const user = users[Math.floor(Math.random() * users.length)];

    //   const comment = {
    //     postId: posts[Math.floor(Math.random() * posts.length)]._id,
    //     comment: `${user.fullname} commented on the post`,
    //     author: user._id,
    //   };

    //   await Comment.create(comment);
    // }

    // Seed post likes
    // for (let i = 0; i < 100000; i++) {
    //   const postLike = {
    //     post: posts[Math.floor(Math.random() * posts.length)]._id,
    //     likeMaker: users[Math.floor(Math.random() * users.length)]._id,
    //   };

    //   await PostLike.create(postLike);
    // }

    // comments likes
    for (let i = 0; i < 100000; i++) {
      const commentLike = {
        comment: comments[Math.floor(Math.random() * comments.length)]._id,
        likeMaker: users[Math.floor(Math.random() * users.length)]._id,
      };

      await CommentLike.create(commentLike);
    }

    console.log("Database seeded successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
})();
