import React from "react";
import { NavLink } from "react-router-dom";

interface SideBarLink {
  link: any;
}

const SideBarLink: React.FC<SideBarLink> = ({ link }) => {
  return (
    <NavLink
      className={(active) => (active.isActive ? " active_link font-bold " : "")}
      to={link.path}
    >
      {({ isActive }) => (
        <li className="flex items-center gap-4 active:scale-95  hover:bg-opacity-10 hover:bg-white p-3 my-1 rounded-lg cursor-pointer">
          {isActive ? link.activeIcon : link.icon}
          <span className=" hidden xl:inline-block">{link.label}</span>
        </li>
      )}
    </NavLink>
  );
};

//  <RiMessengerFill className=" text-2xl " />
//  <RiMessengerLine className=" text-2xl " />
// t("sidebar.messages")
// "/direct/inbox/"

export default SideBarLink;
