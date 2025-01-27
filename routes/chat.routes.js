const express = require("express");
const isAuthenticated = require("../middlewares/auth.middleware");
const {
  getMessages,
  sendMessage,
  getChats,
  deleteMessage,
} = require("../controllers/chat.controller");

const router = express.Router();

router.get("/", isAuthenticated, getChats);
router.get("/:receiverId", isAuthenticated, getMessages);

router.post("/send/:receiverId", isAuthenticated, sendMessage);

router.delete("/:messageId", isAuthenticated, deleteMessage);

module.exports = router;
