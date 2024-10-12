import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

const useAddComment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const addComment = async (postId: string, comment: string) => {
    if (!comment) return;

    setLoading(true);
    try {
      const { data } = await axios.post(`/post/comment/${postId}`, { comment });
      toast.success(data.message);
      queryClient.invalidateQueries("comments");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return { addComment, loading };
};

export default useAddComment;
