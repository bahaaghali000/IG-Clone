import axios from "axios";
import { useDispatch } from "react-redux";
import { setChats } from "../redux/features/conversationSlice";
import { useQuery } from "react-query";

const fetchChats = async () => {
  const { data } = await axios.get("/chat/");

  return data.data;
};

const useGetChats = () => {
  const dipatch = useDispatch();

  const { data, isLoading, isError, error } = useQuery(["chats"], fetchChats);
  dipatch(setChats(data || []));

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     setLoading(true);
  //     try {
  //       const { data } = await axios.get("/chat/");

  //       setConversations(data.data);
  //       dipatch(setChats(data.data));
  //     } catch (error: any) {
  //       toast.error(error.response.data.message);
  //       throw new Error(error.response.data);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchChats();
  // }, []);

  return { data, isLoading, isError, error };
};

export default useGetChats;
