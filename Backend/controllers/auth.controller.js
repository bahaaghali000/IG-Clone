const sendEmail = require("../utils/email");
const crypto = require("crypto");
const User = require("../models/user.model");
const asyncErrorHandler = require("../utils/ErrorHandler");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: process.env.COOKIE_MAXAGE,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30 days",
  });
};

const register = asyncErrorHandler(async (req, res, next) => {
  const { email, username, fullname, password } = req.body;

  // if (!email || !username || !fullname || !password) {
  //   return res.json({
  //     status: "failed",
  //     message: "All fields are required for registration",
  //   });
  // }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (user)
    return next(new AppError("username or email is already exists", 400));

  const newUser = await User.create(req.body);

  const token = await signToken(newUser._id);

  res.cookie("access_token", token, cookieOptions);

  res.status(201).json({
    success: true,
    data: {
      _id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname,
      email: newUser.email,
      avatar: newUser.avatar,
    },
  });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res
      .status(401)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  }).select("+password");

  if (!user) return next(new AppError("username or email is not found", 404));

  const isMatch = await user.comparePassword(password, user.password);

  if (!isMatch)
    return next(new AppError("email or password are incorrect", 400));

  const token = await signToken(user._id);

  res.cookie("access_token", token, cookieOptions);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

const logout = asyncErrorHandler(async (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logout successful" });
});

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("User Not Found", 404));

  const restToken = await user.createRestPasswordToken();

  user.save({ validateBeforeSave: false });

  // send email use rest password link
  const fullUrl =
    process.env.FRONTEND_URL + "/accounts/reset-password/" + restToken;

  try {
    const html = `
          <div>
            <h1 style="text-align: center;">Rest Password Request form IGgram app</h1>
            <h4>Hi ${user.fullname}</h4>
            <p>We earlier recieved a rest password request</p>
            <p>Be aware that the link below will expire 30 minutes after you receive the email</p>
            ${fullUrl}
          </div>
        `;
    await sendEmail({
      to: user.email,
      subject: "Rest password requested",
      html,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    user.save({ validateBeforeSave: false });

    return res.status(400).json({ success: false, message: err.message });
  }
});

const restPassword = asyncErrorHandler(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.restToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError("Invaild token or the link has expired", 400));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  user.save({ validateBeforeSave: false });

  const token = signToken(user.id);

  res.cookie("access_token", token, cookieOptions);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

const getMyInfo = asyncErrorHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = {
  register,
  login,
  forgotPassword,
  restPassword,
  logout,
  getMyInfo,
};
