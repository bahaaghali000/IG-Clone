import React from "react";
import { Message as MessageInterface } from "../../interfaces";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface Props {
  message: MessageInterface;
}

const Message: React.FC<Props> = ({ message }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { selectedConversation } = useSelector(
    (state: RootState) => state.conversation
  );

  const isMe = message?.senderId === userInfo?._id;

  return (
    <div className={` flex items-center gap-3  ${isMe ? "justify-end" : ""}`}>
      {!isMe && (
        <div className=" h-6 w-6 rounded-full overflow-hidden">
          <img
            src={isMe ? userInfo.avatar : selectedConversation?.avatar}
            width={24}
            height={24}
            alt={isMe ? userInfo.username : selectedConversation?.username}
          />
        </div>
      )}

      <div className={``}>
        <p
          className={`px-3 py-2 w-max rounded-full ${
            isMe ? "bg-[#3797f0] text-white" : "dark:bg-[#262626] bg-gray-100"
          }`}
        >
          {message.message}
        </p>
      </div>
    </div>
  );
};

export default Message;
