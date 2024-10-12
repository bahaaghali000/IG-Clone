import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";

const fetchStories = async () => {
  const { data } = await axios.get(`/story`);

  return data;
};
const Stories: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery(
    ["stories"],
    fetchStories
  );

  console.log(data);
  const { userInfo } = useSelector((state: RootState) => state.user);

  return (
    <ul className="mt-3 flex gap-4">
        
      {Array(5)
        .fill("")
        .map((_, index) => (
          <Link
            to={`/stories/${userInfo.username}`}
            className="flex items-center flex-col cursor-pointer "
          >
            <img
              className=" w-16 h-16 rounded-full object-cover border-2 border-red p-0.5"
              src={userInfo.avatar}
              alt={userInfo.username}
            />
            <span className="text-xs text-ellipsis overflow-hidden w-16 ">
              {userInfo.username}
            </span>
          </Link>
        ))}
      {/* {isLoading && <li>Loading...</li>}
      {isError && <li>Error: {error.message}</li>}
      {!isLoading &&
        data.map((story) => (
          <li key={story.id}>
            <h2>{story.title}</h2>
            <p>{story.body}</p>
          </li>
        ))}
      {!isLoading && data.length === 0 && <li>No stories found.</li>} */}
    </ul>
  );
};

export default Stories;
