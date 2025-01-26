const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      trim: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.index({ totalLikes: 1 });

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

postSchema.virtual("likes", {
  ref: "PostLike",
  localField: "_id",
  foreignField: "post",
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
