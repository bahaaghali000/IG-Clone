import React from "react";
import useGetPosts from "../hooks/useGetPosts";
import { IPost } from "../models/Post";
import { Link } from "react-router-dom";

const Explore: React.FC = () => {
  const [posts, loading] = useGetPosts();

  // throw new Error("Not implemented");

  return (
    <div className=" px-4 pt-5">
      <div className=" grid grid-cols-3 gap-1">
        {posts?.length > 0 &&
          posts?.map((post: IPost) => (
            <Link to={`/p/${post._id}`} key={post._id}>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${post.image[0]}`}
                alt={post._id}
                className="aspect-square object-cover"
              />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Explore;
