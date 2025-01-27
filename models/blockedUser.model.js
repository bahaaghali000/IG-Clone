const mongoose = require("mongoose");

const blockedUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blocked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const BlockedUser = mongoose.model("BlockedUser", blockedUserSchema);

module.exports = BlockedUser;
