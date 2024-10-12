import { IUser } from "./User";

export interface IComment {
  postId: string;
  comment: string;
  author: IUser;
  totalLikes: number;
  createdAt: string;
  updatedAt: string;
  _id: string;
}
