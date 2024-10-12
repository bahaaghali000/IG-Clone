import { useState } from "react";
import PostHeader from "./PostHeader";
import { calculateTimeDifference } from "../../../utils";
import PostActions from "./PostActions";
import { IPost } from "../../../models/Post";
import DialogModel from "../Dialog";
import SwiperSlides from "../Swiper/SwiperSlides";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface Props {
  post: IPost;
}

const Post: React.FC<Props> = ({ post }) => {
  const [showOthers, setShowOthers] = useState<boolean>(false);

  const { lng } = useSelector((state: RootState) => state.user);

  const timeDifference = calculateTimeDifference(post.createdAt, lng);

  const handleCloseDialog = () => {
    setShowOthers(false);
  };

  return (
    <article className=" w-[470px] py-6 border-bottom z-0 ">
      <PostHeader
        postId={post._id}
        author={post.author}
        timeDifference={timeDifference}
        hasFollowing={post.hasFollowing}
      />

      <div className="rounded full-border p-3 mt-2 min-h-80 flex items-start justify-center">
        <SwiperSlides
          slides={post.image.map(
            (image: string) => `${import.meta.env.VITE_BACKEND_URL}/${image}`
          )}
        />
      </div>

      {/* Actions */}
      <PostActions postId={post._id} isLoved={post.hasLiked} />

      <div>
        {post?.totalLikes > 0 && (
          <p className="text-sm p-1">
            Liked by{" "}
            {/* <Link to={`/${post.likes[0].username}`} className="font-semibold">
              {post.likes[0].username}
            </Link>{" "} */}
            {post.totalLikes > 2 && (
              <span
                className="font-semibold cursor-pointer"
                onClick={() => setShowOthers(true)}
              >
                and {post.totalLikes - 1} others
              </span>
            )}
          </p>
        )}
      </div>

      <DialogModel
        open={showOthers}
        handleClose={handleCloseDialog}
        title={"Likes"}
      >
        {/* {post.likes.map((like: IUser) => (
          <User user={like} key={like._id} showFollowButton />
        ))} */}
      </DialogModel>
    </article>
  );
};

export default Post;
