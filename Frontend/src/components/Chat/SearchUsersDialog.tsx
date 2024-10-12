import React, { useEffect, useState } from "react";
import DialogModel from "../UI/Dialog";
import { IUser } from "../../models/User";
import { useDispatch } from "react-redux";
import { setSelectedConversation } from "../../redux/features/conversationSlice";
import useSearchUsers from "../../hooks/useSearchUsers";
import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";

interface SearchUsersDialogProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const SearchUsersDialog: React.FC<SearchUsersDialogProps> = ({
  open,
  setOpen,
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  const { fetchUsers } = useSearchUsers();

  const handleSelect = (user: IUser) => {
    dispatch(setSelectedConversation(user));
    setOpen(false);
  };

  useEffect(() => {
    if (!keyword.trim()) {
      return setUsers([]);
    }
    // Debounce
    setLoading(true);
    const timeout = setTimeout(async () => {
      const data = await fetchUsers(keyword.trim());
      setUsers(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <DialogModel
      title="New message"
      handleClose={() => setOpen(false)}
      open={open}
      actionTitle="Chat"
      fullScreen={false}
    >
      <div className="flex gap-3 items-center border-bottom">
        <h2 className="font-semibold">To:</h2>
        <input
          className=" bg-transparent w-full outline-none placeholder:text-white py-2 placeholder:opacity-35"
          placeholder="Search..."
          type="text"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
      </div>

      <div className="mt-5">
        {loading &&
          Array(5)
            .fill(1)
            .map((_, index) => (
              <div key={index} className="flex mb-3 gap-4 items-center">
                <Skeleton
                  sx={{ bgcolor: "grey.900" }}
                  variant="circular"
                  width={40}
                  height={40}
                />
                <div>
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    // variant="circular"
                    width={130}
                    height={30}
                  />
                  <Skeleton
                    sx={{ bgcolor: "grey.900" }}
                    // variant="circular"
                    width={80}
                    height={25}
                  />
                </div>
              </div>
            ))}

        {!loading && users.length > 0 ? (
          users.map((user: IUser) => (
            <Link
              key={user._id}
              to={`/direct/t/${user._id}`}
              className={`flex gap-4 items-center mb-3 cursor-pointer`}
              onClick={() => handleSelect(user)}
            >
              <div className=" rounded-full w-8 h-8 overflow-hidden ">
                <img
                  src={user.avatar}
                  width={32}
                  height={32}
                  alt={user.username}
                />
              </div>
              <div>
                <h2 className=" font-semibold">{user.username}</h2>
                <h4 className=" text-[#a8a8a8]">{user.fullname}</h4>
              </div>
            </Link>
          ))
        ) : (
          <p>No accounts found.</p>
        )}
      </div>
    </DialogModel>
  );
};

export default SearchUsersDialog;
