const express = require("express");
const {
  register,
  login,
  forgotPassword,
  restPassword,
  logout,
  getMyInfo,
} = require("../controllers/auth.controller");
const isAuthenticated = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.patch("/rest-password/:restToken", restPassword);

router.get("/", isAuthenticated, getMyInfo);

module.exports = router;
