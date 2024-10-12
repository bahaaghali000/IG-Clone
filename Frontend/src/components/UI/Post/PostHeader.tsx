import React, { useState } from "react";
import { Link } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IUser } from "../../../models/User";
import DialogAlert from "../DialogAlert";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import useFollowOrUnfollow from "../../../hooks/useFollowOrUnfollow";
import Avatar from "../Avatar";
import { useTranslation } from "react-i18next";

interface PostHeaderProps {
  author: IUser;
  postId: string;
  timeDifference: string;
  hasFollowing: boolean;
  className?: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  author,
  timeDifference,
  postId,
  hasFollowing,
  className = "",
}) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(hasFollowing || false);

  const { lng } = useSelector((state: RootState) => state.user);

  const { followOrUnfollow, loading } = useFollowOrUnfollow();

  const handleFollowOrUnFollow = (username: string) => {
    followOrUnfollow(username);
    setFollowed(!followed);
  };

  const handleClose = () => {
    setShowAlert(false);
  };

  const { t } = useTranslation();

  return (
    <div className={`relative flex items-center gap-2 z-0  ${className}`}>
      <Avatar
        src={author.avatar}
        alt={author.username}
        sx={{ width: 32, height: 32 }}
      />

      <h2 className={lng === "ar" ? "flex gap-2" : ""}>
        <Link
          to={`/${author.username}`}
          className=" font-semibold  hover:opacity-55"
        >
          {author.username}
        </Link>{" "}
        <span className=" opacity-50"> • {timeDifference} </span>
        {!followed && (
          <>
            <span className=" opacity-50"> • </span>
            <span
              className="link opacity-100 font-semibold"
              onClick={() => handleFollowOrUnFollow(author.username)}
            >
              {t("Feed.follow")}
            </span>
          </>
        )}
      </h2>

      <DialogAlert onClose={handleClose} open={showAlert}>
        <h2
          onClick={
            followed
              ? () => {
                  handleFollowOrUnFollow(author.username);
                  handleClose();
                }
              : () => {}
          }
          style={{ borderTop: 0 }}
          className={`dialog__alert-item  ${
            followed ? "font-bold text-[#ed4956]" : ""
          }`}
        >
          {followed ? "Unfollow" : "Not interested"}
        </h2>
        <h2 className="dialog__alert-item">Add to favorites</h2>
        <Link to={`/p/${postId}`} className="dialog__alert-item">
          Go to post
        </Link>
        <h2 className="dialog__alert-item">Share to...</h2>
        <h2 className="dialog__alert-item">Copy link</h2>
      </DialogAlert>

      <MoreHorizIcon
        onClick={() => setShowAlert(true)}
        className={`absolute ${
          lng == "ar" ? " left-0" : "right-0"
        }  cursor-pointer`}
      />
    </div>
  );
};

export default PostHeader;
