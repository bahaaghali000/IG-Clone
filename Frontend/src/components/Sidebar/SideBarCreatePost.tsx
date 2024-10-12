import React, { useCallback, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import CreatePost from "../UI/Post/CreatePost";
import { useTranslation } from "react-i18next";

const SideBarCreatePost: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <li
        onClick={handleClickOpen}
        className="flex items-center gap-4 active:scale-95 hover:bg-opacity-10 hover:bg-white p-3 my-1 rounded-lg cursor-pointer"
      >
        <CiSquarePlus className=" text-2xl " />
        <span className=" hidden xl:inline-block">{t("sidebar.create")}</span>
      </li>

      <CreatePost open={open} handleClose={handleClose} />
    </>
  );
};

export default SideBarCreatePost;
