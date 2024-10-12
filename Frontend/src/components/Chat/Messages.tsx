import { useSelector } from "react-redux";
import Message from "./Message";
import { RootState } from "../../redux/store";
import { useEffect, useRef } from "react";
import { IMessage } from "../../models/Message";

const Messages = () => {
  const { messages } = useSelector((state: RootState) => state.conversation);

  const lastMessageRef = useRef<any>();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      // lastMessageRef.current?.scrollIntoView();
    }, 0);
  }, [messages]);

  return (
    <div className=" px-4 py-3 flex flex-col gap-5 messages  overflow-y-auto">
      {messages.map((message: IMessage) => (
        <div key={message._id} ref={lastMessageRef}>
          <Message message={message} />
        </div>
      ))}
    </div>
  );
};

export default Messages;
