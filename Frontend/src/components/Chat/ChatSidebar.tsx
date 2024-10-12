import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { FaEdit } from "react-icons/fa";
import ConversationsWrapper from "./ConversationsWrapper";

interface ChatSidebarProps {
  setOpen: (open: boolean) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ setOpen }) => {
  const { userInfo, lng } = useSelector((state: RootState) => state.user);
  const { selectedConversation } = useSelector(
    (state: RootState) => state.conversation
  );

  return (
    <div
      className={`px-6 w-96  min-h-full max-md:w-full ${
        selectedConversation ? "" : "max-md:z-40"
      } ${lng == "ar" ? "border-left" : "border-right"}  `}
    >
      <div className=" pt-9  pb-3 flex justify-between items-center">
        <h2 className=" font-bold text-2xl">{userInfo?.username}</h2>

        <span className=" cursor-pointer" onClick={() => setOpen(true)}>
          <FaEdit className=" text-2xl" />
        </span>
      </div>

      <ConversationsWrapper />
    </div>
  );
};

export default ChatSidebar;
