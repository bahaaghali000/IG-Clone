const mongoose = require("mongoose");

const followingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

followingSchema.index({ user: 1, following: 1 }, { unique: true });

const Following = mongoose.model("Following", followingSchema);

module.exports = Following;
