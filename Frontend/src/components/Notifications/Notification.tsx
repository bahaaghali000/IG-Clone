import React from "react";
import Avatar from "../UI/Avatar";
import { calculateTimeDifference } from "../../utils";

const Notification: React.FC<any> = ({ notification }) => {
  const timeDifference = calculateTimeDifference(notification.createdAt);

  if (notification.type === "FOLLOW" || notification.type === "LIKE")
    return (
      <div className="flex items-center justify-between p-2 hover:bg-opacity-10 hover:bg-white">
        <div className="flex items-center gap-5">
          <Avatar
            src={notification.user.avatar}
            alt={notification.user.username}
            sx={{ width: "60px", height: "60px" }}
          />
          <p>
            <span className="font-semibold">{notification.content}</span>.{" "}
            <span className=" opacity-50">{timeDifference}</span>
          </p>
        </div>
        {notification?.post?._id && (
          <div>
            <img
              title={notification.post.caption}
              className=" w-8 h-8 object-cover rounded-md"
              src={`http://localhost:3000/${notification.post.image[0]}`}
              alt={notification.post.caption}
            />
          </div>
        )}
      </div>
    );
};

export default Notification;
