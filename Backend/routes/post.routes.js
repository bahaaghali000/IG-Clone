const express = require("express");

const isAuthenticated = require("../middlewares/auth.middleware");
const {
  newPost,
  allPosts,
  getPostDetails,
  likeOrUnlikePost,
  saveOrUnsavePost,
  updateCaption,
  deletePost,
  newComment,
  likeOrUnlikeComment,
  getPostsOfFollowing,
  getCommentsOfPost,
} = require("../controllers/post.controller");

const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: async function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage });

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  upload.array("files", 10),
  newPost
);

router.get("/all", isAuthenticated, allPosts);
// router.get("/all", allPosts);

router.get("/", isAuthenticated, getPostsOfFollowing);

router.get("/details/:postId", isAuthenticated, getPostDetails);

router
  .route("/:postId")
  .get(isAuthenticated, likeOrUnlikePost)
  .post(isAuthenticated, saveOrUnsavePost)
  .put(isAuthenticated, updateCaption)
  .delete(isAuthenticated, deletePost);

router
  .route("/comment/:postId")
  .get(isAuthenticated, likeOrUnlikeComment)
  .post(isAuthenticated, newComment);

router.get("/:postId/comments", getCommentsOfPost);

module.exports = router;
