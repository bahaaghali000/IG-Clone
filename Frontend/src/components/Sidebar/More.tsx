import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUserInfo, themeSwitcher } from "../../redux/features/userSlice";
import { RxHamburgerMenu } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../redux/store";
import { FiSettings } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

const More = () => {
  const [shown, setShown] = useState<boolean>(false);

  const { darkMode } = useSelector((state: RootState) => state.user);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => setShown(false);

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleResize);
    };
  });

  const navigate = useNavigate();
  const logout = async () => {
    try {
      const { data } = await axios.get("/auth/logout", {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });

      dispatch(setUserInfo(undefined));
      navigate("/accounts/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-4 active:scale-95 max-md:hidden w-full relative hover:bg-opacity-10 hover:bg-white p-3 my-1 rounded-lg cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setShown(!shown);
        }}
      >
        <RxHamburgerMenu className="text-2xl" />
        <span className="hidden select-none  xl:inline-block">
          {t("sidebar.more")}
        </span>
      </div>

      {shown && (
        <div className=" z-50 w-64 p-2 shadow-md absolute bottom-16 md:left-12 lg:left-10 rounded-lg bg-white dark:bg-[#262626] ">
          <ul>
            <Link to="/settings">
              <li className="flex items-center gap-2 active:scale-95 w-full  hover:bg-opacity-10 hover:bg-white py-2 px-3 my-1 rounded-lg cursor-pointer">
                <FiSettings className="text-xl" />
                Settings
              </li>
            </Link>

            <Link to="/saved">
              <li className="flex items-center gap-4 active:scale-95 w-full  hover:bg-opacity-10 hover:bg-white py-2 px-3 my-1 rounded-lg cursor-pointer">
                <i className="fas fa-home"></i>
                saved
              </li>
            </Link>

            <li
              className="w-full flex items-center justify-between  hover:bg-opacity-10 hover:bg-white py-2 px-3 my-1 rounded-lg cursor-pointer"
              onClick={() => dispatch(themeSwitcher())}
            >
              <span>Dark mode</span>
              <div className=" relative w-7 h-4 px-[2px] py-1 flex items-center  rounded-lg bg-gray-400">
                <span
                  className={`absolute ${
                    !darkMode ? "left-[1px]" : ""
                  } dark:absolute dark:right-[1px] w-4 h-4  rounded-full bg-black`}
                ></span>
              </div>
            </li>

            <li
              onClick={logout}
              className="flex items-center gap-4 active:scale-95 w-full  hover:bg-opacity-10 hover:bg-white py-2 px-3 my-1 rounded-lg cursor-pointer"
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default More;
