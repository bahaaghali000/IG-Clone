import Conversation from "./Conversation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChats } from "../../redux/features/conversationSlice";
import { RootState } from "../../redux/store";
import { Skeleton } from "@mui/material";
import { IConversation } from "../../models/Conversation";

const ConversationsWrapper = () => {
  const { chats, loading } = useSelector(
    (state: RootState) => state.conversation
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChats());
  }, []);

  return (
    <div className=" mt-4">
      <div>
        <h2 className=" font-bold text-md">Messages</h2>
      </div>

      <div className=" flex flex-col gap-5 py-5 overflow-hidden">
        {loading &&
          Array(5)
            .fill(1)
            .map((_, index) => (
              <Skeleton
                key={index}
                sx={{ bgcolor: "grey.900" }}
                variant="rounded"
                width={770}
                height={60}
              />
            ))}
        {!loading &&
          chats.map((conversation: IConversation) => (
            <Conversation key={conversation._id} conversation={conversation} />
          ))}
      </div>
    </div>
  );
};

export default ConversationsWrapper;
