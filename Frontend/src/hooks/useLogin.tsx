/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async ({ username, password }: FormData): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", {
        usernameOrEmail: username,
        password,
      });

      toast.success("Logged in successfully");

      dispatch(setUserInfo(data.data));
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return [loading, login];
};

export default useLogin;
