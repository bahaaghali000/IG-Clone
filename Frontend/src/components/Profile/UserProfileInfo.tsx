import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import useFollowOrUnfollow from "../../hooks/useFollowOrUnfollow";
import Button from "../UI/Button/Button";
import { useTranslation } from "react-i18next";
import ProfileActions from "./ProfileActions";

interface Props {
  data: any;
  isMine?: boolean;
}

const UserProfileInfo: React.FC<Props> = ({ data, isMine = false }) => {
  const [followed, setFollowed] = useState(data.isFollowed);

  const { t } = useTranslation();

  const { followOrUnfollow, loading } = useFollowOrUnfollow();

  return (
    <div className=" pb-11 px-10 flex flex-wrap max-md:flex-col gap-10 border-bottom  ">
      <ProfileAvatar user={data?.user} />

      <div className=" flex-[2]">
        <div className=" flex justify-between items-center gap-3 w-96">
          <h2 className=" text-3xl mr-4 font-semibold">{data.user.username}</h2>

          {isMine ? (
            <div className="flex gap-3 items-center">
              <Link
                to="/"
                className=" dark:bg-white dark:bg-opacity-30 dark:text-white bg-[#efefef] text-black rounded-lg px-4 py-2"
              >
                Edit Profile
              </Link>

              <Link
                to="/"
                // className=" dark:bg-[#f5f5f5] dark:text-white bg-[#efefef] text-black rounded-lg px-4 py-2"
              >
                <FiSettings className=" text-2xl" />
              </Link>
            </div>
          ) : (
            <Button
              onClick={async () => {
                await followOrUnfollow(data.user.username);
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
        </div>

        <ProfileActions
          totalFollowersCount={data?.totalFollowersCount}
          totalFollowingCount={data?.totalFollowingCount}
          totalPostsCount={data?.totalPostsCount}
          username={data?.user?.username}
        />

        <div className="mt-4">
          {/* <h3 className=" font-semibold">{.fullname}</h3> */}
          {/* Bio 👇 */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
