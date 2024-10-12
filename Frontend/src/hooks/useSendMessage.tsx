import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/features/conversationSlice";
import { useState } from "react";
import { RootState } from "../redux/store";

const useSendMessage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { messages } = useSelector((state: RootState) => state.conversation);

  const sendMessage = async (message: string, chatId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`chat/send/${chatId}`, { message });

      dispatch(setMessages([...messages, data.data]));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
