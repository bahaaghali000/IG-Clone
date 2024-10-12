import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getMyDetails } from "../redux/features/userSlice";
import ProfileHeader from "../components/Profile/ProfileHeader";
import {
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
} from "../pages";

const Routing = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyDetails());
  }, [dispatch, userInfo?._id]);

  return (
    <Routes>
      <Route
        path="/"
        element={userInfo?._id ? <Home /> : <Navigate to="/accounts/login" />}
      />

      <Route
        path="/accounts"
        element={userInfo?._id ? <Navigate to="/" /> : <Outlet />}
      >
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<FogetPassword />} />
        <Route path="reset-password/:restToken" element={<ResetPassword />} />
      </Route>

      <Route
        path="/:username"
        element={
          <ProfileHeader>
            <Outlet />
          </ProfileHeader>
        }
      >
        <Route index element={<ProfilePosts />} />
        <Route path="saved" element={<Saved />} />
        <Route path="tagged" element={<Tagged />} />
      </Route>

      <Route path="/notifications" element={<Notifications />} />

      <Route path="/explore">
        <Route index element={<Explore />} />
        <Route path="people" element={<SuggestUser />} />
      </Route>

      <Route path="/p/:postId" element={<PostDetails />} />

      <Route path="/direct">
        <Route index element={<Navigate to="inbox" />} />
        <Route path="inbox" element={<Chats />} />
        <Route path="t/:chatId" element={<ChatDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default Routing;
