const { Server } = require("socket.io");
const Chat = require("../models/chat.model");

let onlineUsers = new Set([]);

const addUser = (userId, socketId) => {
  // !onlineUsers.some((user) => user.userId === userId) &&
  //   onlineUsers.push({ userId, socketId });
  onlineUsers.forEach((user) => {
    if (user.userId === userId) {
      onlineUsers.delete(user);
    }
  });
  onlineUsers.add({ userId, socketId });
};

const removeUser = (socketId) => {
  // users = onlineUsers.filter((user) => user.socketId !== socketId);
  onlineUsers.forEach((user) => {
    if (user.socketId === socketId) {
      onlineUsers.delete(user);
    }
  });
};

const getUser = (userId) => {
  // const user = onlineUsers.find((user) => user.userId === userId);
  // return user ? user.socketId : null;
  for (let user of onlineUsers) {
    if (user.userId === userId) {
      return user.socketId;
    }
  }
  return null;
};

let io;
// let notificationsIo;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: "GET, POST, PUT, PATCH, DELETE",
      credentials: true,
    },
  });

  // notificationsIo = io.of("/notifications");

  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getOnlineUsers", Array.from(onlineUsers));
    });

    // typing states
    socket.on("typing", async ({ sender, receiver }) => {
      console.log("called");
      const receiverSocketId = getUser(receiver);

      // find the conversation between the receiver and the sender
      const conversation = await Chat.findOne({
        users: { $all: [sender, receiver] },
      });

      io.to(receiverSocketId).emit("typing", {
        sender,
        conversation: conversation?._id,
      });
    });

    socket.on("typing stop", async ({ sender, receiver }) => {
      const receiverSocketId = getUser(receiver);

      // find the conversation between the receiver and the sender
      const conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
      });

      io.to(receiverSocketId).emit("typing stop", {
        sender,
        conversation: conversation?._id,
      });
    });

    // user disconnected
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("getOnlineUsers", onlineUsers);
    });
  });

  // notificationsIo.on("connection", (socket) => {
  //   console.log(socket.id);
  // });
}

function emitNewMessage(receiverId, message, conversation) {
  const receiverSocketId = getUser(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
      message,
      conversation,
    });
  }
}

function newFollowerNotification(follower, receiverId) {
  const receiverSocketId = getUser(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newFollower", follower);
  }
}

function sendNotification(notification, receiverId) {
  const receiverSocketId = getUser(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newNotification", notification);
  }
}

module.exports = {
  initializeSocket,
  emitNewMessage,
  newFollowerNotification,
  sendNotification,
};
