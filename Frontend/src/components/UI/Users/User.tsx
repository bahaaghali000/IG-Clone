import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../../models/User";
import Button from "../Button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useFollowOrUnfollow from "../../../hooks/useFollowOrUnfollow";
import { useTranslation } from "react-i18next";

interface Props {
  user: IUser;
  className?: string;
  showFollowButton?: boolean;
  showAsLink?: boolean;
  hasFollowing?: boolean;
}

const User: React.FC<Props> = ({
  user,
  className = "",
  showFollowButton = false,
  showAsLink = false,
  hasFollowing = false,
}) => {
  const { userInfo, isAuthenticited } = useSelector(
    (state: RootState) => state.user
  );

  // const [followed, setFollowed] = useState(
  //   isAuthenticited
  //     ? userInfo?.following.some((userId: string) => userId == user._id)
  //     : false
  // );
  const [followed, setFollowed] = useState(hasFollowing || false);

  const { t } = useTranslation();

  const { followOrUnfollow, loading } = useFollowOrUnfollow();

  return (
    <div className={`flex gap-4 items-center justify-between ${className}`}>
      <div className="flex gap-4 items-center mb-3">
        <Link
          to={`/${user.username}`}
          className="block rounded-full w-8 h-8 overflow-hidden "
        >
          <img src={user?.avatar} width={32} height={32} alt={user.username} />
        </Link>
        <div>
          <Link to={`/${user.username}`} className=" font-semibold">
            {user.username}
          </Link>
          <h4 className=" text-[#a8a8a8]">{user.fullname}</h4>
        </div>
      </div>

      {showFollowButton && (
        <Button
          onClick={async () => {
            await followOrUnfollow(user.username);
            setFollowed(!followed);
          }}
          loading={loading}
          className={`px-3 py-0 ${
            followed
              ? "dark:bg-white dark:bg-opacity-30 hover:bg-opacity-50 dark:text-white"
              : "bg-[#3b82f6] hover:bg-[#0069d9] "
          } `}
        >
          {followed ? t("Feed.follower") : t("Feed.follow")}
        </Button>
      )}
      {showAsLink && (
        <span
          onClick={async () => {
            await followOrUnfollow(user.username);
            setFollowed(!followed);
          }}
          className="link block"
        >
          {" "}
          {followed ? t("Feed.follower") : t("Feed.follow")}
        </span>
      )}
    </div>
  );
};

export default User;
