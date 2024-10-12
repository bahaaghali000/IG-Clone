import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import ConversationHeader from "../components/Chat/ConversationHeader";
import Messages from "../components/Chat/Messages";
import { Link, useParams } from "react-router-dom";
import ChatSidebar from "../components/Chat/ChatSidebar";
import InputMessage from "../components/Chat/InputMessage";
import { Skeleton } from "@mui/material";
import Avatar from "../components/UI/Avatar";
import useGetConversation from "../hooks/useGetConversation";
import SearchUsersDialog from "../components/Chat/SearchUsersDialog";
import Helmet from "../components/Common/Helmet";

const ChatDetails = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { chatId } = useParams();

  const { isFirstConversation, getConversation, loading } =
    useGetConversation();

  const { selectedConversation, onlineUsers, chats, messages } = useSelector(
    (state: RootState) => state.conversation
  );

  useEffect(() => {
    getConversation(chatId);
  }, [chatId, chats]);

  const isOnline =
    onlineUsers?.length > 0
      ? onlineUsers?.some((user) => user?.userId === selectedConversation?._id)
      : false;

  return (
    <Helmet title="Chats . Instagram">
      <div className="flex max-md:flex-col">
        <ChatSidebar setOpen={setOpen} />

        <SearchUsersDialog open={open} setOpen={setOpen} />

        <div
          className={`w-full bg-white  h-screen relative max-md:absolute overflow-hidden dark:bg-black ${
            selectedConversation ? "max-md:z-[90] " : ""
          }`}
        >
          {/* user={userChatWith} */}
          <ConversationHeader isOnline={isOnline} />

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10">
              <Avatar
                src={selectedConversation?.avatar}
                alt={selectedConversation?.username}
                isOnline={isOnline}
                sx={{ width: 80, height: 80 }}
              />

              <div className="text-center mt-2">
                <h3>{selectedConversation?.username}</h3>
                <p className="text-white text-opacity-65">
                  {selectedConversation?.username}.Instagram
                </p>
                <Link
                  to={`/${selectedConversation?.username}`}
                  className=" block dark:bg-white dark:bg-opacity-30 text-sm font-semibold dark:text-white bg-[#efefef] text-black rounded-lg px-4 py-[6px] mt-4"
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}

          {!isFirstConversation && loading ? (
            Array(4)
              .fill(1)
              .map((_, index) => (
                <Fragment key={index}>
                  <div className="mx-4 my-3 flex items-center gap-3">
                    <Skeleton
                      sx={{ bgcolor: "grey.900" }}
                      variant="circular"
                      width={40}
                      height={40}
                    />
                    <Skeleton
                      sx={{ bgcolor: "grey.900" }}
                      variant="rounded"
                      width={200}
                      height={40}
                    />
                  </div>
                  <div className="mx-4 my-3 flex items-center justify-start flex-row-reverse gap-3">
                    <Skeleton
                      sx={{ bgcolor: "grey.900" }}
                      variant="circular"
                      width={40}
                      height={40}
                    />
                    <Skeleton
                      sx={{ bgcolor: "grey.900" }}
                      variant="rounded"
                      width={200}
                      height={40}
                    />
                  </div>
                </Fragment>
              ))
          ) : (
            <Messages />
          )}

          <div className="px-3">
            {/* <InputMessage setIsFirstConversation={setIsFirstConversation} /> */}
            <InputMessage />
          </div>
        </div>
      </div>
    </Helmet>
  );
};

export default ChatDetails;
