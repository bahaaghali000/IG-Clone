import React, { useEffect, useState } from "react";
import User from "../components/UI/Users/User";
import axios from "axios";
import { IUser } from "../models/User";

const SuggestUser: React.FC = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  useEffect(() => {
    const getSuggestUsers = async () => {
      try {
        const { data } = await axios.get("/users/suggest");
        setSuggestedUsers(data.data.suggestedUsers);
      } catch (error) {
        console.log(error);
      }
    };
    getSuggestUsers();
  }, []);

  return (
    <div className="flex items-center justify-center pt-20 ">
      <div className="w-[600px] p-3">
        <h2 className=" font-semibold mb-2">Suggested</h2>
        {suggestedUsers.length > 0 &&
          suggestedUsers.map((suggestUser: IUser) => (
            <User user={suggestUser} showFollowButton />
          ))}
      </div>
    </div>
  );
};

export default SuggestUser;
