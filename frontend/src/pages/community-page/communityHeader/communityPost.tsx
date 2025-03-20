/**
 * Renders a list of posts for a specific community with loading states.
 */

import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { API_URL } from "../../../App";
import axios from "axios";
import PostComponent from "../../../components/Post";
import { PostData } from "../../user-page/types";

interface PostsProps {
  postIds: string[];
  viewStates: Record<string, string>;
}

interface PostsState {
  posts: PostData[];
  isLoading: boolean;
  error: string | null;
}

const PostList: React.FC<PostsProps> = ({ postIds }) => {
  const [state, setState] = useState<PostsState>({
    posts: [],
    isLoading: false,
    error: null,
  });

  const getPostById = useCallback(async (postId: string): Promise<PostData | null> => {

    try {
      const response = await axios.get(
        `${API_URL}/posts/get-posts-by-id/${postId}/${localStorage.getItem("id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );


      if (response.data.data) {
        const postBody = response.data.data.body;
        
        // ff the body is already an object with the required fields, use it directly
        if (postBody && typeof postBody === 'object' && '_id' in postBody) {
          return {
            ...response.data.data,
            id: response.data.data._id, 
            body: postBody
          };
        }
        
        // if it's a string ID, fetch the body (fallback case)
        if (typeof postBody === 'string') {
          const bodyResponse = await axios.get(
            `${API_URL}/postBody/get-text-postBody-by-ID/${postBody}/${localStorage.getItem("id")}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );


          return {
            ...response.data.data,
            id: response.data.data._id,
            body: bodyResponse.data.data
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!postIds.length) {
        setState(prev => ({ ...prev, posts: [], isLoading: false }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const postPromises = postIds.map(getPostById);
        const posts = await Promise.all(postPromises);
        
        const filteredPosts = posts.filter((post): post is PostData => post !== null);
        
        setState(prev => ({
          ...prev,
          posts: filteredPosts,
          isLoading: false
        }));
      } catch (error) {
        console.error('Error in fetchPosts:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load posts. Please try again.'
        }));
      }
    };

    fetchPosts();
  }, [postIds, getPostById]);

  if (state.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (state.error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{state.error}</Typography>
      </Box>
    );
  }

  if (!state.posts.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No posts yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {state.posts.map((post) => (
        <PostComponent key={post._id} {...post} />
      ))}
    </Box>
  );
};

export default PostList;
