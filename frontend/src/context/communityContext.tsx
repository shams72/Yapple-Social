/**
 * Global community state manager with infinite scroll support.
 * Handles community data, memberships, and admin privileges.
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
interface communityStructure {
  _id: string;
  profilePictureUrl?:string;
  name: string;
  description: string;
  posts?: string[];
  createdAt: string;
  bannerUrl?: string;
  members?: { role: string; user: string }[];
  links?: [{ platform: string; url: string; _id: string }];
}

interface CommunityContextType {
  communityData: communityStructure[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  setCommunityData: React.Dispatch<React.SetStateAction<communityStructure[]>>;
  setJoinedCommunities: React.Dispatch<React.SetStateAction<Set<string>>>;
  joinedCommunities: Set<string>;
  setAdmin: React.Dispatch<React.SetStateAction<Set<string>>>;
  admin: Set<string>;
  refreshCommunities: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(
  undefined
);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [communityData, setCommunityData] = useState<communityStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(
    new Set()
  );
  const [admin, setAdmin] = useState<Set<string>>(new Set());
  const [_, setPage] = useState(1);

  const fetchCommunities = async (pageNum: number, append = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_URL}/community/get-ten-community/${localStorage.getItem("id")}`,
        {
          params: {
            id: localStorage.getItem("id"),
            page: pageNum
          },
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const newData = response.data.data;

      if (newData.length === 0) {
        setHasMore(false);
        return;
      }

      setCommunityData(prev => append ? [...prev, ...newData] : newData);

      // update joined communities and admin status
      newData.forEach((data: communityStructure) => {
        if (data.members) {
          data.members.forEach(member => {
            if (member.user === localStorage.getItem("id")) {
              if (member.role === "member") {
                setJoinedCommunities(prev => {
                  const updated = new Set(prev);
                  updated.add(data._id);
                  return updated;
                });
              } else if (member.role === "admin") {
                setAdmin(prev => {
                  const updated = new Set(prev);
                  updated.add(data._id);
                  return updated;
                });
              }
            }
          });
        }
      });

    } catch (error) {
      setError("Failed to fetch communities. Please try again.");
      console.error("Error fetching communities:", error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {

    fetchCommunities(1, false);
  }, []);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchCommunities(nextPage, true);
        return nextPage;
      });
    }
  };

  const refreshCommunities = () => {
    setPage(1);
    setHasMore(true);
    fetchCommunities(1, false);
  };

  const value: CommunityContextType = {
    communityData,
    isLoading,
    error,
    hasMore,
    loadMore,
    setCommunityData,
    setJoinedCommunities,
    joinedCommunities,
    setAdmin,
    admin,
    refreshCommunities
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};
