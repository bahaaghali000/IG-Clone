import React from "react";
import Notification from "./Notification";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Notifications: React.FC = () => {
  const { notifications } = useSelector(
    (state: RootState) => state.notifications
  );

  return (
    <div>
      {notifications.map((notification: any) => (
        <Notification key={notification._id} notification={notification} />
      ))}
      {/* <Notification />
      <Notification />
      <Notification /> */}
    </div>
  );
};

export default Notifications;

/*
avatar: "http://localhost:3000/uploads/profile-01.jpeg"
bio: ""
createdAt: "2024-09-20T19:47:31.142Z"
email: "bahaaghali000@gmail.com"
fullname: "Bahaa Ghali"
id: "66edd15315941ca42b39df2e"
isPrivate: false
updatedAt: "2024-09-20T19:47:31.142Z"
username: "bahaaghali"
_id: "66edd15315941ca42b39df2e"
*/
