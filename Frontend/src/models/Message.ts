import { IUser } from "./User";
export interface IMessage {
  _id: string;
  senderId: IUser;
  receiverId: IUser;
  message: string;
  createdAt: string;
  updatedAt: string;
}
