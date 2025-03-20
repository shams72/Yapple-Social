/**
 * Displays a user's posts with loading states and error handling.
 * Manages post deletion and handles missing posts cleanup.
 */

// External package imports
import axios, { AxiosError } from "axios";
import { FC, useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

// Internal components and hooks
import PostComponent from "../../../components/Post";
import { useAuth } from "../../../hooks";

// Internal constants and types
import { API_URL } from "../../../App";
import { PostData } from "../types";

// Import styles
import styles from "./Posts.module.css";

interface PostsProps {
  postsIds: string[];
}

interface PostsState {
  posts: PostData[];
  isLoading: boolean;
  error: string | null;
}

export const Posts: FC<PostsProps> = ({ postsIds }) => {
  const [state, setState] = useState<PostsState>({
    posts: [],
    isLoading: false,
    error: null,
  });

  const { id, token } = useAuth();

  const getPostById = useCallback(
    async (postId: string): Promise<PostData | null> => {
      try {
        const res = await axios.get<{ data: PostData }>(
          `${API_URL}/posts/get-posts-by-id/${postId}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return res.data.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          // Post not found, remove it from user's posts
          await axios.post(
            `${API_URL}/user/remove-post/`,
            {
              id: id,
              postId: postId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        return null;
      }
    },
    [id, token]
  );

  const handleDeletePost = useCallback(
    async (postId: string) => {
      try {
        await axios.post(
          `${API_URL}/user/remove-post/`,
          {
            id: id,
            postId: postId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setState((prev) => ({
          ...prev,
          posts: prev.posts.filter((post) => post._id !== postId),
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to delete post. Please try again.",
        }));
      }
    },
    [id, token]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      if (!postsIds.length) {
        setState((prev) => ({ ...prev, posts: [], isLoading: false }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const postPromises = postsIds.map(getPostById);
        const posts = await Promise.all(postPromises);

        setState((prev) => ({
          ...prev,
          posts: posts.filter((post): post is PostData => post !== null),
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load posts. Please try again.",
        }));
      }
    };

    fetchPosts();
  }, [postsIds, getPostById]);

  if (state.isLoading) {
    return (
      <Box
        className={styles.postContainer}
        sx={{ display: "flex", justifyContent: "center", py: 4 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (state.error) {
    return (
      <Box className={styles.postContainer} sx={{ textAlign: "center", py: 4 }}>
        <Typography color="error">{state.error}</Typography>
      </Box>
    );
  }

  if (!state.posts.length) {
    return (
      <Box className={styles.postContainer} sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">No posts yet</Typography>
      </Box>
    );
  }

  return (
    <div className={styles.postContainer}>
      {state.posts.map((post) => (
        <PostComponent
          key={post._id}
          {...post}
          onDelete={() => handleDeletePost(post._id)}
        />
      ))}
    </div>
  );
};
