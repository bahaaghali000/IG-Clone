import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import Avatar from "../UI/Avatar";
import { IUser } from "../../models/User";
import { IConversation } from "../../models/Conversation";

interface Props {
  conversation: IConversation;
}

const Conversation: React.FC<Props> = ({ conversation }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { selectedConversation } = useSelector(
    (state: RootState) => state.conversation
  );

  const user = conversation.users.find(
    (user: IUser) => user._id !== userInfo?._id
  );

  return (
    <Link
      to={`/direct/t/${user?._id}`}
      className={`relative flex items-center gap-2 cursor-pointer py-2  rounded-md px-3 hover:bg-gray-100  dark:hover:bg-[#121212] ${
        selectedConversation?._id === user._id
          ? "dark:bg-[#121212] bg-gray-100 "
          : ""
      }`}
    >
      <Avatar src={user?.avatar} alt={user?.username} />

      <div className="pl-3">
        <h2 className="font-semibold">{user?.fullname} </h2>
        <h4 className="text-[#a8a8a8]">{conversation.latestMessage}</h4>
      </div>
    </Link>
  );
};

export default Conversation;
