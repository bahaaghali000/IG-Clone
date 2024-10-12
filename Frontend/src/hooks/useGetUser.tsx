import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../models/User";

const useGetUser = (username: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<any>([]);

  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/users/account/${username}`);
        console.log(data);
        // const res = await axios.get(`/users/account/${username}/posts`);

        setUserInfo(data.data);
        // setPosts(res.data.data);
      } catch (error: any) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username]);

  return { loading, userInfo, error, posts };
};

export default useGetUser;
