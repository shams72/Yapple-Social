import React, { FC, useContext, useEffect, useState } from "react";
import { useAuth } from "../../../hooks";
import { userType } from "../types";
import axios from "axios";
import { toastContext, UserContext } from "../../../store";
import { API_URL } from "../../../App";
import { UserCtx } from "../../../types";
import { useParams } from "react-router-dom";

export const UserProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const id = useParams().id;
  const ctx = useContext(toastContext);
  const defaultValue: userType = {
    username: "",
    displayName: "",
    followers: [],
    following: [],
    joinedAt: new Date(),
    bannerPictureUrl: "",
    profilePictureUrl: "",
    posts: [],
    links: [],
    id: "",
  };
  const [userInfo, setUserInfo] = useState<userType>(defaultValue);
  const userInfoCtx: UserCtx = { ...userInfo, setUserInfo: setUserInfo };

  useEffect(() => {
    async function fetchUserata() {
      try {
        const res = await axios.get(API_URL + "/user/" + id, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setUserInfo({
          ...res.data,
          joinedAt: new Date(res.data.joinedAt),
          id: res.data["_id"],
        });
      } catch (error: any) {
        ctx.setOpen((prev) => {
          return {
            ...prev,
            open: true,
            alertColor: "error",
            message: "An error occurred while fetching user data",
          };
        });
      }
    }

    fetchUserata();
  }, [id]);

  return (
    <UserContext.Provider value={userInfoCtx}>{children}</UserContext.Provider>
  );
};
