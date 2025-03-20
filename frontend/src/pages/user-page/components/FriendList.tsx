/**
 * Displays a grid of user cards for followers or following users.
 * Fetches and renders user information for each friend.
 */

import { FC, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../store";
import axios from "axios";
import { API_URL } from "../../../App";
import { userType } from "../types";
import { Userlist } from "./UserList";
import { useAuth } from "../../../hooks";

export const FriendList: FC<{ isFollowers: boolean }> = ({ isFollowers }) => {
  const user = useContext(UserContext);
  const [friendsInfo, setFriendsInfo] = useState<userType[]>([]);
  const friends = isFollowers ? user.followers : user.following;
  const { id } = useAuth();

  useEffect(() => {
    setFriendsInfo([]);
    
    friends.forEach(async (friend) => {
      if (friend === id) return;
      
      const res = await axios.get(`${API_URL}/user/${friend}`);
      setFriendsInfo((prev) => {
        if (prev.find((user) => user.id === res.data["_id"])) {
          return prev;
        }

        return [...prev, { ...res.data, id: res.data["_id"] }];
      });
    });
  }, [friends, id]);

  return (
    <div>
      <Userlist userList={friendsInfo}></Userlist>
    </div>
  );
};
