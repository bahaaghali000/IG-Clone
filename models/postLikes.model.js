const mongoose = require("mongoose");

const postLikeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  likeMaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

postLikeSchema.index({ post: 1, likeMaker: 1 }, { unique: true });

postLikeSchema.post("save", async function (doc, next) {
  const Post = mongoose.model("Post");

  if (doc.post) {
    await Post.findByIdAndUpdate(doc.post, { $inc: { totalLikes: 1 } });
  }

  next();
});

postLikeSchema.post("findOneAndDelete", async function (doc, next) {
  const Post = mongoose.model("Post");

  if (doc?.post) {
    await Post.findByIdAndUpdate(doc.post, { $inc: { totalLikes: -1 } });
  }

  next();
});

const PostLike = mongoose.model("PostLike", postLikeSchema);
module.exports = PostLike;
