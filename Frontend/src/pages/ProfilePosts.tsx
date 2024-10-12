import React, { memo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import ProfilePost from "../components/Profile/ProfilePost";
import { IPost } from "../models/Post";

const fetchProfilePosts = async ({ queryKey }: any) => {
  const [, username] = queryKey;
  const { data } = await axios.get(`/users/account/${username}/posts`);
  console.log(data);
  return data.data;
};
const ProfilePosts: React.FC = memo(() => {
  const { username } = useParams();

  const {
    data: posts,
    isLoading,
    error,
    isError,
  } = useQuery(["profile-posts", username], fetchProfilePosts);

  console.log(error);
  console.log(isLoading);
  console.log(isError);
  console.log(posts);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className=" grid grid-cols-3  gap-1">
      {posts?.length > 0 ? (
        posts.map((p: IPost) => <ProfilePost post={p} key={p._id} />)
      ) : (
        <h2>Doesn't Exsit Any Post</h2>
      )}
    </div>
  );
});

export default ProfilePosts;
