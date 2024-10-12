import User from "../Users/User";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../Footer/Footer";
import { useQuery } from "react-query";
import { IUser } from "../../../models/User";

const getSuggestUsers = async () => {
  const { data } = await axios.get("/users/suggest");
  console.log(data.data);
  return data.data;
};

const Feed: React.FC = () => {
  const { userInfo, lng } = useSelector((state: RootState) => state.user);

  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useQuery(
    ["suggestedUsers"],
    getSuggestUsers
  );

  return (
    <div
      className={`w-[319px] ${
        lng === "en" ? "pl-[64px] " : "pr-[64px] "
      } h-screen max-[1150px]:hidden mt-5`}
    >
      <User user={userInfo} />

      <div className="mt-2">
        <h2 className="font-semibold flex justify-between text-[14px] dark:text-white dark:text-opacity-60 ">
          {t("Feed.title")}
          <Link to="/explore/people" className="link">
            {t("Feed.seeMore")}
          </Link>
        </h2>

        <div className="mt-2">
          {data?.suggestedUsers?.length > 0 &&
            data?.suggestedUsers.map((user: IUser) => (
              <User user={user} key={user._id} showAsLink />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feed;
