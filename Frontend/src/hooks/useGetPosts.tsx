import { useEffect, useState } from "react";
import axios from "axios";
import { IPost } from "../models/Post";

const useGetPosts = () => {
  const [posts, setPosts] = useState<IPost[] | []>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/post/all?limit=20&page=1");

        setPosts(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return [posts, loading];
};

export default useGetPosts;
