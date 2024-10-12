import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetUsetById from "./useGetUsetById";
import { RootState } from "../redux/store";
import useGetMessages from "./useGetMessages";
import { IConversation } from "../models/Conversation";
import { IUser } from "../models/User";
import { setSelectedConversation } from "../redux/features/conversationSlice";

const useGetConversation = () => {
  const [messages, setMessages] = useState([]);
  const [isFirstConversation, setIsFirstConversation] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  const { getUserById } = useGetUsetById();

  const { userInfo } = useSelector((state: RootState) => state.user);

  const { chats } = useSelector((state: RootState) => state.conversation);
  const { loading, fetchMessages } = useGetMessages();

  const getConversation = async (chatId: string) => {
    const currentConversation = chats?.find((conversation: IConversation) =>
      conversation.users.some((user: IUser) => user._id === chatId)
    );

    if (currentConversation) {
      dispatch(
        setSelectedConversation(
          currentConversation.users[0]._id == userInfo?._id
            ? currentConversation.users[1]
            : currentConversation.users[0]
        )
      );

      const messages = await fetchMessages(chatId);
      setMessages(messages);
      setIsFirstConversation(false);
    } else {
      setIsFirstConversation(true);
      const user = await getUserById(chatId);
      dispatch(setSelectedConversation(user));
    }

    return () => dispatch(setSelectedConversation(null));
  };

  return { isFirstConversation, messages, getConversation, loading };
};

export default useGetConversation;
