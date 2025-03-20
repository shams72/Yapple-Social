import { createContext } from "react";
import { UserCtx } from "../types/UserCtx.type";

const defaultValue = {
  username: "",
  displayName: "",
  followers: [],
  following: [],
  joinedAt: new Date(),
  links: [],
  id: "",
  profilePictureUrl: "",
  posts: [],
  setUserInfo: () => {},
};

export const UserContext = createContext<UserCtx>(defaultValue);
