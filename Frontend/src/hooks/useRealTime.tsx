import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  addMessage,
  setOnlineUsers,
} from "../redux/features/conversationSlice";
import { RootState } from "../redux/store";
import { addNotification } from "../redux/features/notificationsSlice";

const useRealTime = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fn = async () => {
      const socket = io("http://localhost:3000");

      socket.on("connect", () => {
        socket.emit("addUser", userInfo?._id);

        socket.on("getOnlineUsers", (data: any[]) => {
          dispatch(setOnlineUsers(data));
        });

        socket.on("newMessage", (data: any) => {
          console.log(data);
          // toast.success("You have a new message", {
          //   icon: "👏",
          //   style: {
          //     borderRadius: "10px",
          //     background: "#333",
          //     color: "#fff",
          //   },
          // });

          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={
                        data.conversation.users[0]._id === userInfo?._id
                          ? data.conversation.users[1].avatar
                          : data.conversation.users[0].avatar
                      }
                      alt={
                        data.conversation.users[0]._id === userInfo?._id
                          ? data.conversation.users[1].username
                          : data.conversation.users[0].username
                      }
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {data.conversation.users[0]._id === userInfo?._id
                        ? data.conversation.users[1].fullname
                        : data.conversation.users[0].fullname}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {data.message.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ));
          dispatch(addMessage(data));
        });

        socket.on("newNotification", (data) => {
          dispatch(addNotification(data));
        });

        socket.on("typing", (data) => {
          console.log(data);
        });
      });

      return () => {
        socket.disconnect();
      };
    };
    if (userInfo?._id) fn();
  }, [userInfo?._id]);

  // useEffect(() => {
  //   const notifactionFn = async () => {
  //     const socket = io("http://localhost:3000/notifications");

  //     socket.on("connect", () => {
  //       console.log("Connected");

  //       socket.on("newFollower", (data) => {
  //         console.log(data);
  //       });
  //     });

  //     return () => {
  //       socket.disconnect();
  //     };
  //   };
  //   if (userInfo?._id) notifactionFn();
  // }, [userInfo?._id]);

  const typing = (sender, receiver) => {
    // const socket = io("http://localhost:3000");
    console.log("called");
    // socket?.emit("typing", { sender, receiver });
  };

  return { typing };
};

export default useRealTime;
