import React from "react";
import User from "./User";
import { IUser } from "../../../models/User";

interface Props {
  users: IUser[];
}

const Users: React.FC<Props> = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
        <User user={user} key={user._id} />
      ))}
    </div>
  );
};

export default Users;
