import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/features/userSlice";

interface FormData {
  username: string;
  fullname: string;
  password: string;
  email: string;
}

const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const signup = async (formData: FormData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        formData
      );

      toast.success("account created successfully");

      dispatch(setUserInfo(data.data));
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return {loading, signup};
};

export default useSignup;
