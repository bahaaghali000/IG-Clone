import { IUser } from "./User";

export interface IPost {
  author: IUser;
  caption: string;
  image: string[];
  likes: IUser[];
  savedBy: IUser[];
  updatedAt: string;
  createdAt: string;
  totalLikes: number;
  hasFollowing?: boolean;
  _id: string;
}
