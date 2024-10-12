import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

import { IoIosArrowBack } from "react-icons/io";
import { setSelectedConversation } from "../../redux/features/conversationSlice";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../UI/Avatar";
// import useRealTime from "../../hooks/useRealTime";

interface ConversationHeaderProps {
  isOnline: boolean;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  isOnline,
}) => {
  const [isTyping, setSsTyping] = useState<boolean>(false);

  const { selectedConversation } = useSelector(
    (state: RootState) => state.conversation
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    // socket?.on("typing", (data) => {
    //   console.log(data);
    // });
  }, []);

  if (!selectedConversation) {
    return "not Found";
  }

  return (
    selectedConversation && (
      <div className=" px-4 py-3 flex items-center justify-between border-bottom">
        <div className=" flex items-center gap-3">
          <IoIosArrowBack
            onClick={() => {
              dispatch(setSelectedConversation(null));
              navigate("/direct/inbox");
            }}
            className=" dark:text-white text-xl cursor-pointer hidden max-md:block"
          />

          <Avatar
            src={selectedConversation?.avatar}
            alt={selectedConversation?.username}
            isOnline={isOnline}
          />
          <div>
            <Link
              to={`/${selectedConversation.username}`}
              className=" font-bold"
            >
              {selectedConversation.fullname}
            </Link>

            {isOnline && (
              <p className="text-[12px] dark:text-white text-opacity-55">
                Online
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ConversationHeader;
