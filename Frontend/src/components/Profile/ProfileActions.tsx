import React, { useState, useTransition } from "react";
import DialogModel from "../UI/Dialog";
import Users from "../UI/Users/Users";
import axios from "axios";
import { useQuery } from "react-query";
import User from "../UI/Users/User";
import { IUser } from "../../models/User";
import { useTranslation } from "react-i18next";

interface ProfileActionsProps {
  totalFollowersCount: number;
  totalFollowingCount: number;
  totalPostsCount: number;
  username: string;
}

const fetchFollowers = async ({ queryKey }: any) => {
  const [, tab, username] = queryKey;
  const { data } = await axios.get(`/users/account/${username}/${tab}`);

  return data.data;
};

const ProfileActions: React.FC<ProfileActionsProps> = ({
  totalFollowersCount,
  totalFollowingCount,
  totalPostsCount,
  username,
}) => {
  const [tab, setTab] = useState<"followers" | "following">("following");
  const [isPending, startTransition] = useTransition();
  const [shown, setShown] = useState<boolean>(false);

  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useQuery(
    ["profile-followers", tab, username],
    fetchFollowers
  );

  console.log(data);

  const handleCloseFollowingDialog = () => {
    setShown(false);
  };

  function selectTab(nextTab: React.SetStateAction<"followers" | "following">) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <ul className="mt-5 flex">
        <li className="flex gap-2 mr-10">
          <span className=" font-semibold">{totalPostsCount || 0} </span>
          <h2>{t("Profile.posts")}</h2>
        </li>

        <div
          className="flex gap-2 mr-10 cursor-pointer"
          onClick={() => {
            setShown(true);
            selectTab("followers");
          }}
        >
          <span className=" font-semibold">{totalFollowersCount}</span>
          <h2>{t("Profile.followers")}</h2>
        </div>

        <div
          className="flex gap-2 mr-10 cursor-pointer"
          onClick={() => {
            setShown(true);
            selectTab("following");
          }}
        >
          <span className=" font-semibold">{totalFollowingCount}</span>
          <h2>{t("Profile.following")}</h2>
        </div>
      </ul>
      <DialogModel
        title={<h2 className=" capitalize">{tab}</h2>}
        open={shown}
        handleClose={handleCloseFollowingDialog}
      >
        <div className="flex gap-14 justify-center items-center">
          <div
            onClick={() => selectTab("followers")}
            className={`${
              tab === "followers" ? "border-t font-bold " : ""
            } text-sm cursor-pointer`}
          >
            <span className=" py-3 block">Followers</span>
          </div>

          <div
            onClick={() => selectTab("following")}
            className={`${
              tab === "following" ? "border-t font-bold " : ""
            } text-sm cursor-pointer`}
          >
            <span className=" py-3 block">Following</span>
          </div>
        </div>

        <div className="px-8 py-2">
          {data?.map((user: IUser) => (
            <User
              user={user}
              showFollowButton
              hasFollowing={tab === "following" ? true : false}
            />
          ))}
        </div>
      </DialogModel>{" "}
    </>
  );
};

export default ProfileActions;
