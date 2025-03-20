/**
 * Form for creating new posts within a community with live preview.
 */

import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../App";
import "./createCommunityPost.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CreatePostForm from "../createPost/createPostForm";
import PostPreview from "../createPost/postPreview";
import { DateTime } from "luxon";

interface CreateCommunityPostProps {
  setCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
  communityID?: string;
}

const CreateCommunityPost: React.FC<CreateCommunityPostProps> = ({
  setCreatePost,
  communityID,
}) => {
  const [postType, setPostType] = useState("");
  const [title, setTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [revealAt, setRevealAt] = useState<DateTime | null>(null);
  const [expiresAt, setExpiresAt] = useState<DateTime | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState(communityID || "");

  type PostData = {
    id: string;
    author: string;
    title: string;
    postType: string;
    body?: string;
    community?: string;
    revealAt?: Date;
    expiresAt?: Date;
  };

  type PostBody = {
    id: string;
    text: string;
    image?: string;
    video?: string;
  };

  const uploadFile = async (file: File, type: "image" | "video") => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_URL}/media/upload-and-save-to-disk`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.url;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      return null;
    }
  };

  const handleCreateNormalPost = async () => {
    try {
      const postBodyData: PostBody = {
        id: localStorage.getItem("id") || "default-id",
        text: postBody,
      };

      if (imageFile) {
        postBodyData.image = await uploadFile(imageFile, "image");
      }

      const postBodyResponse = await axios.post(
        `${API_URL}/postBody/add-postBody`,
        postBodyData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const postData: PostData = {
        id: localStorage.getItem("id") || "default-id",
        author: localStorage.getItem("id") || "default-id",
        title: title,
        postType: "normal",
        body: postBodyResponse.data.data,
        community: selectedCommunity,
      };

      const postResponse = await axios.post(
        `${API_URL}/posts/create-normal-post`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await axios.put(
        `${API_URL}/community/add-postID-by-communityID`,
        {
          id: localStorage.getItem("id"),
          communityID: selectedCommunity,
          postID: postResponse.data.data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCreatePost(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleTimeCapsulePost = async () => {
    if (!revealAt) {
      console.error("Please set the reveal date");
      return;
    }

    try {
      const postBodyData: PostBody = {
        id: localStorage.getItem("id") || "default-id",
        text: postBody,
      };

      if (imageFile) {
        postBodyData.image = await uploadFile(imageFile, "image");
      }

      const postBodyResponse = await axios.post(
        `${API_URL}/postBody/add-postBody`,
        postBodyData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const postData: PostData = {
        id: localStorage.getItem("id") || "default-id",
        author: localStorage.getItem("id") || "default-id",
        title: title,
        postType: "timeCapsule",
        body: postBodyResponse.data.data,
        revealAt: revealAt.toJSDate(),
        expiresAt: revealAt.plus({ years: 100 }).toJSDate(),
        community: selectedCommunity,
      };

      const postResponse = await axios.post(
        `${API_URL}/posts/create-time-capsule-post`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await axios.put(
        `${API_URL}/community/add-postID-by-communityID`,
        {
          id: localStorage.getItem("id"),
          communityID: selectedCommunity,
          postID: postResponse.data.data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCreatePost(false);
    } catch (error) {
      console.error("Error creating time capsule post:", error);
    }
  };

  const handleSelfDestructPost = async () => {
    if (!expiresAt) {
      console.error("Please set an expiry date");
      return;
    }

    try {
      const postBodyData: PostBody = {
        id: localStorage.getItem("id") || "default-id",
        text: postBody,
      };

      if (imageFile) {
        postBodyData.image = await uploadFile(imageFile, "image");
      }

      const postBodyResponse = await axios.post(
        `${API_URL}/postBody/add-postBody`,
        postBodyData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const postData: PostData = {
        id: localStorage.getItem("id") || "default-id",
        author: localStorage.getItem("id") || "default-id",
        title: title,
        postType: "selfDestruct",
        body: postBodyResponse.data.data,
        expiresAt: expiresAt.toJSDate(),
        community: selectedCommunity,
      };

      const postResponse = await axios.post(
        `${API_URL}/posts/create-self-destruct-post`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await axios.put(
        `${API_URL}/community/add-postID-by-communityID`,
        {
          id: localStorage.getItem("id"),
          communityID: selectedCommunity,
          postID: postResponse.data.data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCreatePost(false);
    } catch (error) {
      console.error("Error creating self destruct post:", error);
    }
  };

  const handleUploadPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImgUrl(objectUrl);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="arrange-contents">
          <div className="modal-content">
            <CreatePostForm
              setTitle={setTitle}
              setPostBody={setPostBody}
              handleUploadPreview={handleUploadPreview}
              postType={postType}
              setPostType={setPostType}
              revealAt={revealAt}
              setRevealAt={setRevealAt}
              expiresAt={expiresAt}
              setExpiresAt={setExpiresAt}
              setCreatePost={setCreatePost}
              handleCreateNormalPost={handleCreateNormalPost}
              handleSelfDestructPost={handleSelfDestructPost}
              handleTimeCapsulePost={handleTimeCapsulePost}
              selectedCommunity={selectedCommunity}
              setSelectedCommunity={setSelectedCommunity}
            />
          </div>
          <PostPreview
            title={title}
            postBody={postBody}
            imgUrl={imgUrl}
            postType={postType}
            revealAt={revealAt}
            expiresAt={expiresAt}
          />
        </div>
      </div>
    </>
  );
};

export default CreateCommunityPost;
