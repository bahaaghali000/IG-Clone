const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    saved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

savedPostSchema.index({ user: 1, saved: 1 }, { unique: true });

const SavedPost = mongoose.model("SavedPost", savedPostSchema);

module.exports = SavedPost;
