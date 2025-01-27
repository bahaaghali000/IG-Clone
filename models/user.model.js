const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dtvbuahbi/image/upload/v1705673678/instagram/lbhpwzmijlqxo39vv4ny.jpg",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ username: "text", email: "text" });

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.comparePassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

userSchema.methods.createRestPasswordToken = function () {
  const restToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(restToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

  return restToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
