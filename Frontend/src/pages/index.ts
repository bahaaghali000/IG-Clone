import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const Chats = lazy(() => import("./Chats"));
const ChatDetails = lazy(() => import("./ChatDetails"));
const FogetPassword = lazy(() => import("./FogetPassword"));
const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));
const ResetPassword = lazy(() => import("./ResetPassword"));
const Saved = lazy(() => import("./Saved"));
const Tagged = lazy(() => import("./Tagged"));
const ProfilePosts = lazy(() => import("./ProfilePosts"));
const PostDetails = lazy(() => import("./PostDetails"));
const NotFound = lazy(() => import("./NotFound"));
const Explore = lazy(() => import("./Explore"));
const SuggestUser = lazy(() => import("./SuggestUser"));
const Notifications = lazy(() => import("./Notifications"));

export {
  Home,
  Chats,
  ChatDetails,
  FogetPassword,
  Login,
  Signup,
  ResetPassword,
  Saved,
  Tagged,
  ProfilePosts,
  PostDetails,
  NotFound,
  Explore,
  SuggestUser,
  Notifications,
};
