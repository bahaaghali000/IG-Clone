import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, useEffect } from "react";
import { setIsDarkMode, setLng } from "./redux/features/userSlice";
import type { RootState } from "./redux/store";
import Routing from "./Routes/Routes";
import axios from "axios";
import SplashScreen from "./components/UI/SplashScreen/SplashScreen";
import useRealTime from "./hooks/useRealTime";
import ErrorBoundary from "./components/ErrorBoundary";
import { getNotifications } from "./redux/features/notificationsSlice";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();

  const { lng, isAuthenticited } = useSelector(
    (state: RootState) => state.user
  );

  const location = useLocation();

  useRealTime();

  useEffect(() => {
    dispatch(setLng());
    dispatch(setIsDarkMode());
    if (isAuthenticited) dispatch(getNotifications());
  }, [dispatch, isAuthenticited]);

  return (
    <>
      {!location.pathname.includes("accounts") && <Sidebar />}
      {/* {location.pathname.includes("direct") && <ChatSidebar />} */}

      <main
        className={`min-h-screen max-md:min-h-[90vh] max-md:top-10 dark:bg-black
bg-white relative max-md:z-10 ${
          lng === "en" ? "md:pl-20 xl:pl-64 " : "md:pr-20 xl:pr-64 "
        }`}
      >
        <ErrorBoundary fallback={<p>Something Went Wroung</p>}>
          <Suspense fallback={<SplashScreen />}>
            <Routing />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
};

export default App;
