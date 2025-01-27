const Joi = require("joi");
const AppError = require("../utils/AppError");

// Regular expression to enforce English letters only (no numbers or special characters)
const usernameRegex = /^[A-Za-z]+$/;

// Validation schema for user registration
const signupSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .required()
    .regex(usernameRegex)
    .message(
      "Username must contain only English letters (no numbers or special characters)."
    ),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("male", "female").required(),
  bio: Joi.string().allow("").optional(),
  avatar: Joi.string().optional(),
  isPrivate: Joi.boolean().optional(),
});

// Validation schema for user login
const loginSchema = Joi.object({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required(),
});

// Validation schema for forgot password
const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Validation schema for verifying reset password code
const verifyCodeSchema = Joi.object({
  verificationCode: Joi.string().length(4).required(),
});

// Validation schema for updating password
const updatePasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

// Validation middleware for user registration
const signupValidation = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  next();
};

// Validation middleware for user login
const loginValidation = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  next();
};

// Validation middleware for forgot password
const forgetPasswordValidation = (req, res, next) => {
  const { error } = forgetPasswordSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  next();
};

// Validation middleware for verifying reset password code
const verifyCodeValidation = (req, res, next) => {
  const { error } = verifyCodeSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  next();
};

// Validation middleware for updating password
const updatePasswordValidation = (req, res, next) => {
  const { error } = updatePasswordSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  next();
};

module.exports = {
  signupValidation,
  loginValidation,
  forgetPasswordValidation,
  verifyCodeValidation,
  updatePasswordValidation,
};
