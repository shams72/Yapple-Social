/**
 * Main user profile page layout with banner, avatar, and content sections.
 * Shows friend suggestions and posts for logged-in user's profile.
 */

import { useContext } from "react";
import { UserContext } from "../../../store";
import { FriendSuggestion } from "./FriendsSuggestion";
import { API_URL } from "../../../App";
import styles from "./UserPageContent.module.css";
import { Avatar, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks";
import { Posts } from "./Posts";

export const UserPageContent = () => {
  const userInfo = useContext(UserContext);
  const profileId = useParams()["id"];
  const { id } = useAuth();
  const isLoggedUser = profileId == id;


  

  return (
    <div className={styles.container}>
      <Box sx={{ width: "100%", position: "relative" }}>
        <img
          src={`${API_URL}/${userInfo.bannerPictureUrl}`}
          alt="Banner"
          className={styles.bannerImage}
        />
        <Avatar
          src={`${API_URL}/${userInfo.profilePictureUrl}`}
          sx={{
            position: "absolute",
            left: "7em",
            bottom: "2em",
            width: "6em",
            height: "6em",
            fontSize: "1.1em",
            border: "4px solid",
            borderColor: "background.paper",
            bgcolor: '#f0f0f0',
            color: '#000'
          }}
        >
          {userInfo.displayName?.[0]?.toUpperCase()}
        </Avatar>
      </Box>
      {isLoggedUser && <FriendSuggestion></FriendSuggestion>}

      <Posts postsIds={userInfo.posts}></Posts>
    </div>
  );
};
