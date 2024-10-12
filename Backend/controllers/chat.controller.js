const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const { emitNewMessage } = require("../sockets/socket");
const AppError = require("../utils/AppError");
const asyncErrorHandler = require("../utils/ErrorHandler");

const getChats = asyncErrorHandler(async (req, res) => {
  const chats = await Chat.find({ $or: [{ users: req.user._id }] })
    .populate({
      path: "users",
      select: "username fullname avatar _id",
    })
    .select("-__v");

  return res.status(200).json({
    success: true,
    data: chats,
  });
});

const getMessages = asyncErrorHandler(async (req, res, next) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: req.params.receiverId },
      { senderId: req.params.receiverId, receiverId: req.user._id },
    ],
  });

  if (!messages.length) return next(new AppError("Chat not found", 404));

  res.status(200).json({
    success: true,
    data: messages,
  });
});

const sendMessage = asyncErrorHandler(async (req, res) => {
  const { message } = req.body;
  const receiverId = req.params.receiverId;
  const senderId = req.user._id;

  // Find the conversation between the receiver and the sender
  let chat = await Chat.findOne({
    users: { $all: [senderId, receiverId] },
  });

  if (!chat) {
    // Create a conversation
    chat = await Chat.create({
      users: [receiverId, senderId],
    });
  }

  const msg = await Message.create({
    senderId,
    receiverId,
    message,
  });

  chat.latestMessage = message;

  await chat.save();

  const chatWithUsers = await Chat.findById(chat._id).populate("users");

  emitNewMessage(receiverId, msg, chatWithUsers);

  res.status(201).json({
    success: true,
    message: "message sent successfully",
    data: msg,
  });
});

module.exports = {
  getMessages,
  sendMessage,
  getChats,
};
