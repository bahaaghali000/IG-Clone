import React from "react";
import UserProfileInfo from "./UserProfileInfo";
import { NavLink, useParams } from "react-router-dom";
import Helmet from "../Common/Helmet";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { NotFound } from "../../pages";
import { useQuery } from "react-query";
import { PiSquaresFour } from "react-icons/pi";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface Props {
  children: React.ReactNode;
}

const fetchProfileHeaderInfo = async ({ queryKey }: any) => {
  const [, username] = queryKey;
  const { data } = await axios.get(`/users/account/${username}`, {
    headers: {
      "Accept-Language": "ar",
    },
  });

  return data.data;
};

const ProfileHeader: React.FC<Props> = ({ children }) => {
  const { username } = useParams();

  // const { loading, userInfo: userInformation } = useGetUser(username);

  const { data, isLoading, error, isError } = useQuery(
    ["profile-header-details", username],
    fetchProfileHeaderInfo
  );

  const { t } = useTranslation();

  const { userInfo } = useSelector((state: RootState) => state.user);

  if (isLoading) <div>Loading...</div>;

  if (!data) {
    return <NotFound />;
  }

  const isMine = userInfo?._id === data.user._id;

  return (
    <Helmet
      title={`${data.user.fullname} (@${data.user.username}) . Instagram`}
    >
      <div className=" px-5 py-8">
        <UserProfileInfo data={data} isMine={isMine} />

        <div className=" flex justify-center">
          <div className="flex gap-14  ">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                isActive ? "border-top font-semibold text-sm" : "text-sm"
              }
            >
              <div className="flex items-center gap-2">
                <PiSquaresFour className="" />
                <span className=" py-3 block uppercase">{t("Profile.posts")}</span>
              </div>
            </NavLink>

            {isMine && (
              <NavLink
                to="saved"
                className={({ isActive }) =>
                  isActive
                    ? " border-top font-semibold"
                    : " dark:text-white text-opacity-50"
                }
              >
                <span className=" py-3 block">SAVED</span>
              </NavLink>
            )}

            <NavLink
              to="tagged"
              className={({ isActive }) =>
                isActive
                  ? " border-top font-semibold "
                  : " dark:text-white text-opacity-50"
              }
            >
              <span className=" py-3 block">Tagged</span>
            </NavLink>
          </div>
        </div>

        {children}
      </div>
    </Helmet>
  );
};

export default ProfileHeader;
