import React, { memo } from "react";
import { IComment } from "../../../models/Comment";
import Comment from "./Comment";

interface CommentsProps {
  comments: IComment[];
}

const Comments: React.FC<CommentsProps> = memo(({ comments }) => {
  return (
    <div className="flex-1 px-3 py-1 overflow-y-scroll">
      {comments?.length > 0 ? (
        comments?.map((comment: IComment, index: number) => (
          <Comment key={comment.comment + index} comment={comment} />
        ))
      ) : (
        <p className="text-center mt-5 dark:text-white dark:text-opacity-25 text-gray-300 text-opacity-100">
          No Comments{" "}
        </p>
      )}
    </div>
  );
});

export default Comments;
