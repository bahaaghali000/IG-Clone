const mongoose = require("mongoose");

const commentLikeSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  likeMaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


commentLikeSchema.index({ comment: 1, likeMaker: 1 }, { unique: true });

commentLikeSchema.post("save", async function (doc, next) {
  const Comment = mongoose.model("Comment");

  if (doc.comment) {
    await Comment.findByIdAndUpdate(doc.comment, { $inc: { totalLikes: 1 } });
  }

  next();
});

commentLikeSchema.post("findOneAndDelete", async function (doc, next) {
  const Comment = mongoose.model("Comment");

  if (doc?.comment) {
    await Comment.findByIdAndUpdate(doc.comment, { $inc: { totalLikes: -1 } });
  }

  next();
});

const CommentLike = mongoose.model("CommentLike", commentLikeSchema);
module.exports = CommentLike;
