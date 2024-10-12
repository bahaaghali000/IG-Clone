import axios from "axios";
import { useParams } from "react-router-dom";
import Helmet from "../components/Common/Helmet";
import PostHeader from "../components/UI/Post/PostHeader";
import { calculateTimeDifference } from "../utils";
import PostActions from "../components/UI/Post/PostActions";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useQuery } from "react-query";
import SwiperSlides from "../components/UI/Swiper/SwiperSlides";
import Comments from "../components/UI/Post/Comments";
import NumsOfLikes from "../components/UI/Post/NumsOfLikes";
import AddCommentForm from "../components/UI/Post/AddCommentForm";

const fetchPost = async ({ queryKey }: any) => {
  const [, postId] = queryKey;
  const { data } = await axios.get(`post/details/${postId}`);

  return data.data;
};

const fetchPostComments = async ({ queryKey }: any) => {
  const [, postId] = queryKey;
  const { data } = await axios.get(`/post/${postId}/comments?limit=${100}`);

  return data.data;
};

const PostDetails = () => {
  const { postId } = useParams();

  const { isAuthenticited } = useSelector((state: RootState) => state.user);

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery(["post-details", postId], fetchPost);

  const {
    data: commentsFetched,
    isLoading: commentsLoading,
    isError: commentsIsError,
    error: commentsError,
  } = useQuery(["comments", postId], fetchPostComments);

  const timeDifference = calculateTimeDifference(post?.createdAt);

  console.log(post);

  if (isLoading) return <div>Loading...</div>;

  return (
    post && (
      <Helmet title={post.caption}>
        <article className="px-10 pt-10  flex flex-col justify-center z-0">
          <div className=" flex items-stretch full-border max-md:flex-col ">
            <div className="max-md:block hidden">
              <PostHeader
                className="p-3 border-bottom "
                author={post?.author}
                postId={post?._id}
                timeDifference={timeDifference}
                hasFollowing={post.hasFollowed}
              />
            </div>
            <div className=" flex-[1.2] max-md:flex-1 w-[470px] max-md:w-full full-border min-h-80 flex items-start justify-center">
              <SwiperSlides
                slides={post.image.map(
                  (image: string) => `http://localhost:3000/${image}`
                )}
              />
            </div>

            <div className=" flex-[0.8] max-md:flex-1 flex flex-col min-h-full">
              <div className="max-md:hidden">
                <PostHeader
                  className="p-3 border-bottom "
                  author={post?.author}
                  postId={post?._id}
                  timeDifference={timeDifference}
                  hasFollowing={post?.hasFollowed}
                />
              </div>

              <Comments comments={commentsFetched} />

              <div className=" border-top pb-5 px-1">
                <PostActions postId={post._id} isLoved={post.hasLiked} />
                <NumsOfLikes totalLikes={post.totalLikes} />

                {isAuthenticited && <AddCommentForm postId={postId} />}
              </div>
            </div>
          </div>
        </article>
      </Helmet>
    )
  );
};

export default PostDetails;
