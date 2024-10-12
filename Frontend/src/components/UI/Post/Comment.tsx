import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";
import { IComment } from "../../../models/Comment";

interface CommentProps {
  comment: IComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className={`flex gap-4 items-center justify-between }`}>
      <div className="flex gap-4 items-center mb-3">
        <Link
          to={`/${comment.author?.username}`}
          className="block rounded-full w-8 h-8 overflow-hidden "
        >
          <Avatar
            src={comment.author?.avatar}
            alt={comment.author?.username}
            sx={{ width: 32, height: 32 }}
          />
        </Link>
        <div>
          <Link to={`/${comment.author?.username}`} className=" font-semibold">
            {comment.author?.username}
          </Link>
          <h4 className=" text-[#a8a8a8]">{comment?.comment}</h4>
        </div>
      </div>
    </div>
  );
};

export default Comment;
