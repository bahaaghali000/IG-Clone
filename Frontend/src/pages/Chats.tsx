import { useState } from "react";
import ChatSidebar from "../components/Chat/ChatSidebar";
import SplashChat from "../components/Chat/SplashChat";
import SearchUsersDialog from "../components/Chat/SearchUsersDialog";
import Helmet from "../components/Common/Helmet";

const Chats: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Helmet title="Chats . Instagram">
      <div className=" flex">
        <ChatSidebar setOpen={setOpen} />

        <SplashChat setOpen={setOpen} />

        {/* Do the same in the ChatDetails */}
        <SearchUsersDialog open={open} setOpen={setOpen} />
      </div>
    </Helmet>
  );
};

export default Chats;
