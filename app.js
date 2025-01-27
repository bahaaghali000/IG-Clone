const express = require("express");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const usersRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const chatRouter = require("./routes/chat.routes");
const storiesRouter = require("./routes/stories.routes");
const notificationsRouter = require("./routes/notifications.routes");
const globalErrorHandler = require("./controllers/error.controller");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/stories", express.static("stories"));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/story", storiesRouter);
app.use("/api/v1/notifications", notificationsRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to instagram clone</h1>");
});

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Not Found",
  });
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
