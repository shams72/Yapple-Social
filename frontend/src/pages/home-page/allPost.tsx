/**
 * Main feed page that displays all posts in a scrollable list.
 * Features: Infinite scroll, post sorting, self-destructing posts,
 * and real-time post expiration handling.
 */

import React, { useEffect, useRef, useState } from "react";
import { usePost } from "../../context/postContext";
import "./allPost.css";
import axios from "axios";
import { API_URL } from "../../App";
import { DateTime } from "luxon";
import PostList from "./postStructure";

const AllPost: React.FC = () => {
  const { postData, loadMore, refreshPosts } = usePost();
  const timersScheduledRef = useRef(new Set<string>());
  const [viewStates, _] = useState<Record<string, string>>({});
  const [sortedPosts, setSortedPosts] = useState(postData);
  const [sortBy, setSortBy] = useState("newest");; 

  // add function to check if post is expired
  const isPostExpired = (post: any) => {
    if (post.postType === "selfDestruct" && post.expiresAt) {
      const expiryTime = DateTime.fromISO(post.expiresAt.toString());
      const now = DateTime.now();
      return expiryTime <= now;
    }
    return false;
  };

  // filter out expired posts before rendering
  postData?.filter(post => !isPostExpired(post));

  // handle infinite scroll
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 40) {
      loadMore();
      window.location.reload();
    }
  };

  // handle self-destructing posts
  const handleSelfDestruct = async (postId: string) => {
    try {
      await axios.delete(
        `${API_URL}/posts/delete-post-by-ID/${postId}/${localStorage.getItem("id")}`,
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      refreshPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // schedule timers for self-destruct and time capsule posts
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    postData?.forEach((post) => {
      const postId = post._id;

      if (post.postType === "selfDestruct" && post.expiresAt && !timersScheduledRef.current.has(postId)) {
        const destroyTimeUTC = new Date(post.expiresAt).getTime();
        const currentTimeUTC = new Date().getTime();
        const timeUntilSelfDestruct = destroyTimeUTC - currentTimeUTC;

        if (timeUntilSelfDestruct > 0) {
          const timerId = setTimeout(() => handleSelfDestruct(postId), timeUntilSelfDestruct);
          timersScheduledRef.current.add(postId);
          timers.push(timerId);
        }
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [postData]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sorted = [...postData].sort((a, b) => {
      switch (sortBy) {
        case "best":
          return (b.votes?.length || 0) - (a.votes?.length || 0);
        case "hot":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    setSortedPosts(sorted);
  }, [postData, sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  return (
    <PostList
      postData={sortedPosts}
      viewStates={viewStates}
      onSortChange={handleSortChange}
    />
  );
};

export default AllPost;