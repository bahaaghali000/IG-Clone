const express = require("express");
const {
  register,
  login,
  forgotPassword,
  restPassword,
  logout,
  getMyInfo,
} = require("../controllers/auth.controller");
const {
  signupValidation,
  loginValidation,
  forgetPasswordValidation,
  updatePasswordValidation,
} = require("../validations/authSchema");
const isAuthenticated = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", signupValidation, register);

router.post("/login", loginValidation, login);

router.get("/logout", logout);

router.post("/forgot-password", forgetPasswordValidation, forgotPassword);

router.patch(
  "/rest-password/:restToken",
  updatePasswordValidation,
  restPassword
);

router.get("/", isAuthenticated, getMyInfo);

module.exports = router;

module.exports = router;
