/**
 * Global post state manager with infinite scroll and post type handling.
 * Manages normal, self-destruct, and time capsule posts.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import axios from "axios";
import { API_URL } from "../App";
import { useAuth } from "../hooks";

interface NormalPost {
  _id: string;
  author: {
    displayName: string;
  };
  title: string;
  body: {
    text: string;
    image?: string;
    video?: string;
  };
  postType: "normal";
  votes?: string[];
  comments?: string[];
  createdAt: string;
}

interface SelfDestructPost {
  _id: string;
  author: {
    displayName: string;
  };
  title: string;
  body: {
    text: string;
    image?: string;
    video?: string;
  };
  postType: "selfDestruct";
  expiresAt: string;
  votes?: string[];
  comments?: string[];
  createdAt: string;
}

interface TimeCapsulePost {
  _id: string;
  author: {
    displayName: string;
  };
  title: string;
  body: {
    text: string;
    image?: string;
    video?: string;
  };
  postType: "timeCapsule";
  expiresAt: string;
  revealAt: string;
  votes?: string[];
  comments?: string[];
  createdAt: string;
}

type PostStructure = NormalPost | SelfDestructPost | TimeCapsulePost;

interface PostContextType {
  postData: PostStructure[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  setPostData: React.Dispatch<React.SetStateAction<PostStructure[]>>;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  user: string;
  setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
  profilePicture: string;
  refreshPosts: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [postData, setPostData] = useState<PostStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [_, setPage] = useState(1);
  const { id } = useAuth();

  const fetchPosts = async (_: number, append = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      if (!token || !userId) {
        setError("Not authenticated");
        return;
      }

      const response = await axios.post(
        `${API_URL}/posts/get-ten-post`,
        {
          seenLastIDs: append ? postData.map((post) => post._id) : [],
          id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newData = response.data.data;

      if (!newData || newData.length === 0) {
        setHasMore(false);
        return;
      }

      setPostData((prev) => (append ? [...prev, ...newData] : newData));
    } catch (error) {
      setError("Failed to fetch posts. Please try again.");
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_URL}/user/${localStorage.getItem("id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data.displayName);
      setProfilePicture(`${API_URL}/${response.data.profilePictureUrl}`);
    } catch (error) {
      setError("Failed to fetch user. Please try again.");
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchUserInfo();
    fetchPosts(1, false);
  }, [id]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchPosts(nextPage, true);
        return nextPage;
      });
    }
  };

  const refreshPosts = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1, false);
  };

  const value: PostContextType = {
    postData,
    isLoading,
    error,
    hasMore,
    loadMore,
    user,
    profilePicture,
    setProfilePicture,
    setUser,
    setPostData,
    refreshPosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
