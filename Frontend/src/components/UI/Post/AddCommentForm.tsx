import { useState } from "react";
import Avatar from "../Avatar";
import { useSelector } from "react-redux";
import useAddComment from "../../../hooks/useAddComment";
import { RootState } from "../../../redux/store";

const AddCommentForm = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState<string>("");

  const { userInfo } = useSelector((state: RootState) => state.user);

  const { addComment } = useAddComment();
  const handleAddComment = async (e) => {
    e.preventDefault();
    await addComment(postId, comment);
    setComment("");
  };

  return (
    <form
      onSubmit={handleAddComment}
      className="flex items-center justify-between px-2 py-1 gap-2 w-full"
    >
      <div className="flex gap-2">
        {" "}
        <Avatar
          src={userInfo.avatar}
          alt={userInfo.username}
          sx={{ width: 35, height: 35 }}
        />
        <input
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          placeholder="add a comment..."
          className="bg-transparent outline-none"
        />
      </div>
      {comment.trim() && (
        <button className="link" type="submit">
          Post
        </button>
      )}
    </form>
  );
};

export default AddCommentForm;
