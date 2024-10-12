const express = require("express");
const isAuthenticated = require("../middlewares/auth.middleware");
const {
  getMessages,
  sendMessage,
  getChats,
} = require("../controllers/chat.controller");

const router = express.Router();

router.get("/", isAuthenticated, getChats);
router.get("/:receiverId", isAuthenticated, getMessages);

router.post("/send/:receiverId", isAuthenticated, sendMessage);

module.exports = router;
