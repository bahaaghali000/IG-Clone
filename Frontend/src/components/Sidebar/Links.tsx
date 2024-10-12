import { NavLink } from "react-router-dom";
import { GoHome, GoHomeFill, GoSearch } from "react-icons/go";
import {
  MdOutlineExplore,
  MdFavoriteBorder,
  MdFavorite,
  MdExplore,
} from "react-icons/md";
import { RiMessengerLine, RiMessengerFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import SideBarLink from "./SideBarLink";
import SideBarCreatePost from "./SideBarCreatePost";
// import Tooltip from "@mui/material/Tooltip";

const Links: React.FC = () => {
  const { t } = useTranslation();

  const { userInfo } = useSelector((state: RootState) => state.user);

  if (!userInfo) {
    return <h2>Loading....</h2>;
  }

  return (
    <ul className="dark:bg-black relative md:flex-[2] md:mt-4 bg-white max-md:flex max-md:z-[9999] max-md:border-top max-md:px-2 max-md:fixed max-md:bottom-0 max-md:right-0 max-md:w-full max-md:justify-between ">
      <SideBarLink
        link={{
          path: "/",
          activeIcon: <GoHomeFill className=" text-2xl " />,
          icon: <GoHome className=" text-2xl " />,
          label: t("sidebar.home"),
        }}
      />

      <NavLink to="/explore">
        <li className="flex items-center gap-4 active:scale-95  hover:bg-opacity-10 hover:bg-white p-3 my-1 rounded-lg cursor-pointer">
          <GoSearch className=" text-2xl" />
          <span className=" hidden xl:inline-block">{t("sidebar.search")}</span>
        </li>
      </NavLink>

      <SideBarLink
        link={{
          path: "/explore",
          activeIcon: <MdExplore className=" text-2xl " />,
          icon: <MdOutlineExplore className=" text-2xl " />,
          label: t("sidebar.explore"),
        }}
      />

      <SideBarLink
        link={{
          path: "/direct/",
          activeIcon: <RiMessengerFill className=" text-2xl " />,
          icon: <RiMessengerLine className=" text-2xl " />,
          label: t("sidebar.messages"),
        }}
      />

      <SideBarLink
        link={{
          path: "/notifications",
          activeIcon: <MdFavorite className=" text-2xl " />,
          icon: <MdFavoriteBorder className=" text-2xl " />,
          label: t("sidebar.notifications"),
        }}
      />

      <SideBarCreatePost />

      <NavLink
        className={(active) =>
          active.isActive ? " active_link font-bold " : ""
        }
        to={`/${userInfo.username}`}
      >
        {({ isActive }) => (
          <li className="flex items-center gap-4 active:scale-95 w-full hover:bg-opacity-10 hover:bg-white p-3 my-1 rounded-lg cursor-pointer">
            <span
              className={`ml-1 w-6 h-6 rounded-full ${
                isActive
                  ? "borrder border-2 dark:border-white border-black"
                  : ""
              }  overflow-hidden`}
            >
              <img src={userInfo.avatar} />
            </span>
            <span className=" hidden xl:inline-block">
              {t("sidebar.profile")}
            </span>
          </li>
        )}
      </NavLink>
    </ul>
  );
};

export default Links;
