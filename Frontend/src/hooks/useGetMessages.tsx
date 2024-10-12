import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setMessages as setMessagesRedux } from "../redux/features/conversationSlice";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchMessages = async (chatId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/chat/${chatId}`);

      dispatch(setMessagesRedux(data.data));
      return data.data;
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchMessages };
};

export default useGetMessages;
