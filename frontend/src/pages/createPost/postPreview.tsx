import React from "react";
import Post from "../../components/Post";
import { DateTime } from "luxon";
import { usePost } from "../../context/postContext";
interface PostPreviewProps {
  title: string;
  postBody: string;
  imgUrl: string | null;
  postType: string;
  revealAt: DateTime | null;
  expiresAt: DateTime | null;
}

const PostPreview: React.FC<PostPreviewProps> = ({ title, postBody, imgUrl, postType, revealAt, expiresAt }) => {
  // create a mock post data object that matches the post component's expected format just for preview

  const { user,profilePicture } = usePost();
  
  const previewPostData = {
    _id: "preview",
    id: "preview",
    profilePic: profilePicture ,
    author: {
      username: user,
      _id: localStorage.getItem("id") || "preview-user",
      displayName: localStorage.getItem("id") || "You",
    },
    title: title,
    postType: postType,
    body: {
      id: "preview-body",
      text: postBody,
      ...(imgUrl && { image: imgUrl })
    },
    createdAt: new Date().toISOString(),
    revealAt: revealAt?.toJSDate().toISOString(),
    expiresAt: expiresAt?.toJSDate().toISOString(),
  };

  return (
    <div className="post-preview-container">
      <h2 style={{ marginBottom: "1rem", color: "#666" }}>Preview</h2>
      <Post {...previewPostData} isPreview={true} />
    </div>
  );
};

export default PostPreview;
