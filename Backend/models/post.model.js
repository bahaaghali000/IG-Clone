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
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.methods.hasLiked = async function (userId) {
  const postLike = await this.model("PostLike").findOne({
    post: this._id,
    likeMaker: userId,
  });

  return !!postLike;
};

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

// postSchema.pre(/^find/, async function (next) {
//   this.populate({
//     path: "author",
//     match: { isPrivate: false },
//   });

//   next();
// });
postSchema.post(/^find/, async function (docs, next) {
  // console.log(docs);
  // this => query
  // const isPriavte = await this.model("Post")
  //   .findById(this._id)
  //   .select("author");

  // this.find({$nor: {}});
  // console.log(isPriavte);
  // console.log(this.author);

  next();
});

// userSchema.post(/^find/, function (docs, next) {
//   // this => query

//   console.log(docs);
//   next();
// });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
