import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const useGetUsetById = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getUserById = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/users/account/id/${id}`);

      return data.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getUserById };
};

export default useGetUsetById;
