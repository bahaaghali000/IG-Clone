const mongoose = require("mongoose");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const { emitNewMessage } = require("../sockets/socket");
const AppError = require("../utils/AppError");
const asyncErrorHandler = require("../utils/ErrorHandler");

const getChats = asyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * pageSize;

  const chatsAgg = Chat.aggregate([
    {
      $match: {
        $or: [{ users: new mongoose.Types.ObjectId(req.user._id) }],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        pipeline: [
          {
            $match: req.query.search
              ? {
                  name: {
                    $regex: search,
                    $options: "i",
                  },
                }
              : {},
          },

          { $project: { username: 1, fullname: 1, avatar: 1, _id: 1 } },
        ],
        as: "users",
      },
    },
    { $skip: skip },
    { $limit: pageSize },
  ]);

  // take a long time
  const totalCountPromise = Chat.countDocuments({
    $or: [{ users: new mongoose.Types.ObjectId(req.user._id) }],
  });

  const [chats, totalCount] = await Promise.all([chatsAgg, totalCountPromise]);

  return res.status(200).json({
    success: true,
    data: {
      chats,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      hasMore: page * pageSize < totalCount,
    },
  });
});

const getMessages = asyncErrorHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * pageSize;

  const me = new mongoose.Types.ObjectId(req.user._id);
  const receiver = new mongoose.Types.ObjectId(req.params.receiverId);

  const messagesAgg = Message.aggregate([
    {
      $match: {
        $or: [
          { senderId: me, receiverId: receiver },
          { senderId: receiver, receiverId: me },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        senderId: 1,
        receiverId: 1,
        message: 1,
      },
    },
    { $skip: skip },
    { $limit: pageSize },
  ]);

  // take a long time
  const totalCountPromise = Message.countDocuments({
    $or: [
      { senderId: me, receiverId: receiver },
      { senderId: receiver, receiverId: me },
    ],
  });

  const [messages, totalCount] = await Promise.all([
    messagesAgg,
    totalCountPromise,
  ]);

  if (!messages.length) return next(new AppError("Chat not found", 404));

  res.status(200).json({
    success: true,
    data: {
      messages,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      hasMore: page * pageSize < totalCount,
    },
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

const updateMessage = asyncErrorHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findOne({
    _id: messageId,
    senderId: req.user._id,
  });

  if (!message)
    return next(new AppError("You do not have permission to do this.", 400));

  message.message = req.body.message;

  await message.save();

  return res.status(200).json({
    success: true,
    message: "message updated successfully",
  });
});

const deleteMessage = asyncErrorHandler(async (req, res, next) => {
  const { messageId } = req.params;

  // check if I sender message or not
  const message = await Message.findOne({
    _id: messageId,
    senderId: req.user._id,
  });

  if (!message)
    return next(new AppError("You do not have permission to do this.", 400));

  await message.deleteOne();

  return res.status(200).json({
    success: true,
    message: "message deleted successfully",
  });
});

module.exports = {
  getMessages,
  sendMessage,
  getChats,
  updateMessage,
  deleteMessage,
};
