import { IUser } from "./User";

export interface IConversation {
    _id: string;
    users: IUser[];
    createdAt: string;
    updatedAt: string;
    latestMessage: string;
  }