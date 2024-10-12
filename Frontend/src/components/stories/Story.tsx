import React from "react";
import { Link } from "react-router-dom";

interface StoryProps {
  story: any;
}

const Story: React.FC<StoryProps> = ({ story }) => {
  return (
    <Link
      to={`/stories/${story.owner.username}`}
      className="flex items-center flex-col cursor-pointer border-2 border-red"
    >
      <img
        className=" w-16 h-16 rounded-full object-cover "
        src={story.owner.avatar}
        alt={story.owner.username}
      />
      <span className="text-xs">{story.owner.username}</span>
    </Link>
  );
};

export default Story;
