import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import useSendMessage from "../../hooks/useSendMessage";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import useRealTime from "../../hooks/useRealTime";

const InputMessage = () => {
  const [message, setMessage] = useState("");

  const { selectedConversation } = useSelector(
    (state: RootState) => state.conversation
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  const { sendMessage, loading } = useSendMessage();
  const { typing } = useRealTime();
  // const socketRef = useRef(null);
  // const typingTimeoutRef = useRef(null);

  // useEffect(() => {
  //   socketRef.current = io("http://localhost:3000");

  //   return () => {
  //     socketRef.current.disconnect();
  //   };
  // }, []);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message, selectedConversation._id);
    setMessage("");
    // setIsFirstConversation(false);
  };

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
    // clearTimeout(typingTimeoutRef.current);

    if (e.target.value) {
      typing(userInfo?._id, selectedConversation?._id);
    }

    //   typingTimeoutRef.current = setTimeout(() => {
    //     socketRef.current.emit("typing stop", {
    //       sender: userInfo._id,
    //       receiver: selectedConversation.users.find(
    //         (user) => user._id !== userInfo._id
    //       )._id,
    //     });
    //   }, 100);
    // } else {
    //   socketRef.current.emit("typing stop", {
    //     sender: userInfo._id,
    //     receiver: selectedConversation.users.find(
    //       (user) => user._id !== userInfo._id
    //     )._id,
    //   });
    // }
  };
  return (
    <form
      onSubmit={handleSend}
      className=" absolute flex bottom-5 w-[97%] rounded-full overflow-hidden pl-3 pr-4 py-2 full-border "
    >
      <input
        type="text"
        placeholder="Message..."
        className=" w-full bg-transparent outline-none"
        onChange={handleChangeMessage}
        value={message}
      />

      {!message.trim() && (
        <div>
          <FaMicrophone className=" text-2xl" />
        </div>
      )}

      {message.trim() && (
        <button
          type="submit"
          className=" font-medium select-none text-[#0095f6] cursor-pointer dark:hover:text-white hover:text-black"
        >
          {loading ? <span className="loader"></span> : "Send"}
        </button>
      )}
    </form>
  );
};

export default InputMessage;
