import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

const useFollowOrUnfollow = () => {
  // profile-header-details
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const followOrUnfollow = async (username: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/users/follow/${username}`);

      queryClient.invalidateQueries("profile-header-details");
      // queryClient.invalidateQueries("posts");

      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      setError(true);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, followOrUnfollow, error };
};

export default useFollowOrUnfollow;
