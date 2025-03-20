/**
 * Grid layout container for displaying multiple user cards.
 * Shows a message when the list is empty.
 */

import { FC } from "react";
import { userType } from "../types";
import { UserCard } from "./UserCard";
import { v4 } from "uuid";

export const Userlist: FC<{ userList: userType[] }> = ({ userList }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "3em",
        flexWrap: "wrap",
      }}
    >
      {!userList.length ? (
        <div>No Friend . add Some friends Boy</div>
      ) : (
        userList.map((user) => <UserCard key={v4()} {...user} />)
      )}
    </div>
  );
};
