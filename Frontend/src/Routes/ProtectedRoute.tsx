import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);

  if (!userInfo?._id) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};
export default ProtectedRoute;
