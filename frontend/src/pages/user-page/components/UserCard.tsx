/**
 * Clickable user profile card with avatar and display name.
 * Navigates to user's profile page on click.
 */

import { FC, useEffect } from "react";
import { userType } from "../types";
import Avatar from "@mui/material/Avatar";
import styles from "./UserCard.module.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../App";

export const UserCard: FC<userType> = ({ ...user }) => {
  const navigate = useNavigate();
  useEffect(() => {}, []);

  const handleNavigate = ()=>{
    navigate("/user-page/"+user.id); 
  }

  return (
    <button className={styles.cardContainer} onClick={handleNavigate}>
      <Avatar 
        src={user.profilePictureUrl ? `${API_URL}/${user.profilePictureUrl}` : undefined}
        sx={{ 
          width: 56, 
          height: 56,
          bgcolor: '#f0f0f0',
          color: '#2c2c2c'
        }}
      >
        {user.displayName?.[0]?.toUpperCase()}
      </Avatar>
      <p>{user.displayName}</p>
    </button>
  );
};
