import React from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../models/Post";
import { FaComment } from "react-icons/fa6";

interface ProfilePostProps {
  post: IPost;
}

const ProfilePost: React.FC<ProfilePostProps> = ({ post }) => {
  return (
    <Link
      to={`/p/${post._id}`}
      className="profile__post relative overflow-hidden "
    >
      <img
        src={`http://localhost:3000/${post.image[0]}`}
        alt={post._id}
        className="aspect-square object-cover"
      />
      <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className=" mx-10">
          <FaComment />
          {post.totalLikes}
        </span>
        {/* <span>{p.comments.length}</span> */}
      </div>
    </Link>
  );
};

export default ProfilePost;
