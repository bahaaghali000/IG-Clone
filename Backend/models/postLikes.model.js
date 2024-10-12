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

const PostLike = mongoose.model("PostLike", postLikeSchema);
module.exports = PostLike;
