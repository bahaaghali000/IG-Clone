import More from "./More";
import { useSelector } from "react-redux";
import Links from "./Links";
import type { RootState } from "../../redux/store";
import SearchInput from "../UI/SeachInput";
import { useState } from "react";
import Logo from "./Logo";

const Sidebar = () => {
  const [search, setSearch] = useState<string>("");

  const { lng } = useSelector((state: RootState) => state.user);

  return (
    <div
      className={`dark:text-white max-md:z-0 z-10  text-black fixed  max-md:w-full  flex flex-col justify-between xl:w-64 min-h-screen p-3  ${
        lng === "en" ? "border-right " : "border-left"
      } ${location.pathname.includes("/direct") ? "" : ""} `}
    >
      <div
        className={`max-md:flex fixed w-full top-0 dark:bg-black bg-white hidden min-h-7 z-50 px-6 justify-between items-center border-bottom ${
          location.pathname.includes("/direct") ? "max-md:hidden" : ""
        }`}
      >
        <h1>
          <span className="sidebar__logo"></span>
        </h1>
        <SearchInput search={search} setSearch={setSearch} />
      </div>

      <Logo />

      <Links />

      <More />
    </div>
  );
};

export default Sidebar;
