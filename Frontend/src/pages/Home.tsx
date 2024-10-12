import Helmet from "../components/Common/Helmet";
import Post from "../components/UI/Post/Post";
import Feed from "../components/UI/Feed/Feed";
import { IPost } from "../models/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import Stories from "../components/stories/Stories";

const fetchData = async ({ queryKey }: any) => {
  const [, page] = queryKey;
  const { data } = await axios.get(`/post/all?limit=10&page=${page}`);
  return data;
};

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { data, isLoading, isError, error } = useQuery(
    ["posts", page],
    fetchData,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
      setPosts((prevPosts) => [...prevPosts, ...data.data]); // Append new posts
    }
  }, [data]);

  const fetchMoreData = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Helmet title="Instagram">
      <div className="flex justify-center container ">
        <div className=" flex flex-col gap-3 items-center ">
          <Stories />
          <div className=" py-6">
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMoreData}
              hasMore={page < totalPages}
              loader={
                <div className=" flex justify-center items-center py-0.5 overflow-hidden">
                  <span className="loader"></span>
                </div>
              }
              endMessage={<p>No more data to load.</p>}
            >
              {posts.length > 0 &&
                posts.map((post: IPost) => <Post key={post._id} post={post} />)}
            </InfiniteScroll>
          </div>
        </div>
        <Feed />
      </div>
    </Helmet>
  );
};

export default Home;
