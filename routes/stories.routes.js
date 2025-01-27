const express = require("express");
const isAuthenticated = require("../middlewares/auth.middleware");
const {
  createStory,
  getStoriesOfUser,
  deleteStory,
  getStoriesOfFollowingUsers,
} = require("../controllers/story.controller");
const multer = require("multer");

const router = express.Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "stories/");
  },
  filename: async function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage });

router
  .route("/")
  .get(isAuthenticated, getStoriesOfFollowingUsers)
  .post(isAuthenticated, upload.single("file"), createStory);
// router.route("/").post(upload.single("file"), createStory);

router.route("/:userId").get(isAuthenticated, getStoriesOfUser);

router.route("/:storyId").delete(isAuthenticated, deleteStory);

module.exports = router;
