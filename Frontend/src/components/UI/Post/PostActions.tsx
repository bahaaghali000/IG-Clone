import axios from "axios";
import React, { useState } from "react";
import { FaRegHeart, FaComment, FaRegComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { NavLink } from "react-router-dom";

interface Props {
  postId: string;
  isLoved?: boolean;
}

const PostActions: React.FC<Props> = ({ postId, isLoved = false }) => {
  const [isLiked, setIsLiked] = useState<boolean>(isLoved);

  const handleClick = async () => {
    try {
      const { data } = await axios.get(`/post/${postId}`);
      console.log(data);
      if (data.message == "Post Liked") setIsLiked(true);
      else setIsLiked(false);
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
    }
    // setIsLiked(!isLiked);
  };

  return (
    <div className="p-2 mt-2 flex justify-between gap-4">
      <div className="flex gap-4">
        <span
          className=" cursor-pointer active:scale-95 hover:opacity-55"
          onClick={handleClick}
        >
          {isLiked ? (
            <FaHeart className=" text-red-600 text-2xl" />
          ) : (
            <FaRegHeart className=" text-2xl" />
          )}
        </span>
        <NavLink
          to={`/p/${postId}`}
          className=" cursor-pointer active:scale-95 hover:opacity-55"
        >
          <FaRegComment className=" text-2xl " />
        </NavLink>
        <span className=" cursor-pointer active:scale-95 hover:opacity-55">
          <FiSend className=" text-2xl" />
        </span>
      </div>
      <svg
        aria-label="Save"
        className="cursor-pointer active:scale-95 hover:opacity-55"
        fill="currentColor"
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
      >
        <title>Save</title>
        <polygon
          fill="none"
          points="20 21 12 13.44 4 21 4 3 20 3 20 21"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></polygon>
      </svg>
    </div>
  );
};

export default PostActions;
