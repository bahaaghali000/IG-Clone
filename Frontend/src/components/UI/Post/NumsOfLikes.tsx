import React from "react";

interface NumsOfLikesProps {
  totalLikes: number;
}

const NumsOfLikes: React.FC<NumsOfLikesProps> = ({ totalLikes }) => {
  return (
    <div>
      {totalLikes > 0 && (
        <p className="text-sm p-1">
          {/* Liked by{" "}
        <Link
          to={`/${post.likes[0].username}`}
          className="font-semibold"
        >
          {post.likes[0].username}
        </Link>{" "} */}
          {totalLikes > 2 && (
            <span
              className="font-semibold cursor-pointer"
              // onClick={() => setShowOthers(true)}
            >
              and {totalLikes - 1} others
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export default NumsOfLikes;
