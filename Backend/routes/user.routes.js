const express = require("express");
const {
  getUser,
  getAllUsers,
  followOrUnfollow,
  getProfile,
  getPostsOfUser,
  getUserById,
  getSuggestUsers,
  updateProfilePicture,
  updateProfileDetails,
  getFollowersOfUser,
  getFollowingsOfUser,
} = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/auth.middleware");

const multer = require("multer");
const isMightAuthenticated = require("../middlewares/isMightAuthenticated");

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

router.get("/", isAuthenticated, getAllUsers);
// router.get("/", getAllUsers);
router.get("/account/id/:id", isAuthenticated, getUserById);
router.get("/account/:username", isMightAuthenticated, getUser);
router.get("/account/:username/posts", getPostsOfUser);
router.get("/account/:username/followers", getFollowersOfUser);
router.get("/account/:username/following", getFollowingsOfUser);

router.patch(
  "/account/picture",
  isAuthenticated,
  upload.single("profilePicture"),
  updateProfilePicture
);
router.patch("/account", isAuthenticated, updateProfileDetails);
router.get("/follow/:username", isAuthenticated, followOrUnfollow);
router.get("/suggest", isAuthenticated, getSuggestUsers);

router.route("/me").get(isAuthenticated, getProfile);
module.exports = router;
