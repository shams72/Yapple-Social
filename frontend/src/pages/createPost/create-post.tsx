import React, { useState, useEffect } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./createPost.css";
import axios from "axios";
import { usePost } from "../../context/postContext";
import { API_URL } from "../../App";
import CreatePostForm from "./createPostForm";
import PostPreview from "./postPreview";
import { DateTime } from 'luxon';

interface CreatePostProps {
  setCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ setCreatePost, onSuccess, onError }) => {
  const [postType, setPostType] = useState("");
  const [title, setTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [revealAt, setRevealAt] = useState<DateTime | null>(null);
  const [expiresAt, setExpiresAt] = useState<DateTime | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const { refreshPosts } = usePost();

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

  const assignPostToUser = async (
    id: string,
    token: string,
    postId: string
  ) => {
    try {
      await axios.post(
        `${API_URL}/user/add-post`,
        {
          id: id,
          postId: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error assigning post to user:", error);
      throw error;
    }
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
        ...(selectedCommunity && { community: selectedCommunity })
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

      await assignPostToUser(
        localStorage.getItem("id") || "",
        localStorage.getItem("token") || "",
        postResponse.data.data._id
      );

      // only add post to community if a community was selected
      if (selectedCommunity) {
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
      }

      window.location.reload();

      refreshPosts();
      onSuccess?.();
      setCreatePost(false);
    } catch (error) {
      console.error("Error creating post:", error);
      onError?.(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleTimeCapsulePost = async () => {
    if (!revealAt) {
      onError?.("Please set the reveal date");
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
        ...(selectedCommunity && { community: selectedCommunity })
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

      await assignPostToUser(
        localStorage.getItem("id") || "",
        localStorage.getItem("token") || "",
        postResponse.data.data._id
      );

      // only add post to community if a community was selected
      if (selectedCommunity) {
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
      }

      window.location.reload();


      refreshPosts();
      onSuccess?.();
      setCreatePost(false);
    } catch (error) {
      console.error("Error creating time capsule post:", error);
      onError?.(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleSelfDestructPost = async () => {
    if (!expiresAt) {
      onError?.("Please set an expiry date");
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
        ...(selectedCommunity && { community: selectedCommunity })
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

      await assignPostToUser(
        localStorage.getItem("id") || "",
        localStorage.getItem("token") || "",
        postResponse.data.data._id
      );

      // Only add post to community if a community was selected
      if (selectedCommunity) {
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
      }

      window.location.reload();
      refreshPosts();
      onSuccess?.();
      setCreatePost(false);
    } catch (error) {
      console.error("Error creating self destruct post:", error);
      onError?.(error instanceof Error ? error.message : "Unknown error");
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

  useEffect(() => {
    return () => {
      if (imgUrl && imgUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [imgUrl]);

  return (
    <div className="create-post-layout">
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
      <PostPreview
        title={title}
        postBody={postBody}
        imgUrl={imgUrl}
        postType={postType}
        revealAt={revealAt}
        expiresAt={expiresAt}
      />
    </div>
  );
};

export default CreatePost;
