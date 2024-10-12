import { IPost } from "./Post";

export interface IUser {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
  email: string;
  bio: string;
  closeFriends?: IUser[];
  bloced: IUser[];
  followers: string[];
  following: string[];
  posts: IPost[];
  isPrivate: boolean;
  //   saved?: Post[];
}
