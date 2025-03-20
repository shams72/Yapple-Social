/**
 * Main community page displaying posts, info, and member interactions.
 */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./viewCommunity.css";
import { useCommunity } from "../../context/communityContext";
import CommunityInfo from "./communityInfo";
import ImageUploader from "./uploadCommunityImages";
import { API_URL } from "../../App";
import CommunityBannerProfile from "./communityHeader/communityHeader";
import PostList from "./communityHeader/communityPost";
import { Box, styled } from "@mui/material";

// interface NormalPost {
//   id: string;
//   author: string;
//   title: string;
//   description: string;
//   image?: string;
//   video?: string;
//   postType: "normal";
//   votes?: string[];
//   comments?: string[];
// }

// interface SelfDestructPost {
//   id: string;
//   author: string;
//   title: string;
//   description: string;
//   image?: string;
//   video?: string;
//   postType: "selfDestruct";
//   expiresAt: string;
//   votes?: string[];
//   comments?: string[];
// }

// interface TimeCapsulePost {
//   id: string;
//   author: string;
//   title: string;
//   description: string;
//   image?: string;
//   video?: string;
//   postType: "timeCapsule";
//   expiresAt: string;
//   revealAt: string;
//   votes?: string[];
//   comments?: string[];
// }

// type postCommunityStructure = NormalPost | SelfDestructPost | TimeCapsulePost;

interface UserInfo {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  profilePictureUrl?: string;
}

interface CommunityMember {
  role: string;
  user: UserInfo;
}

interface SimpleMember {
  role: string;
  user: string;
}

interface communityStructure {
  _id: string;
  name: string;
  description: string;
  posts?: string[];
  createdAt: string;
  bannerUrl?:string;
  members?: SimpleMember[];
  links?: { platform: string; url: string }[];
}

// const StyledButton = styled(Button)(({ theme }) => ({
//   borderRadius: '20px',
//   padding: '8px 24px',
//   textTransform: 'none',
//   fontWeight: 600,
// }));

const PageContainer = styled("div")({
  color: "white",
  marginTop: "6em",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "0 2em",
  maxWidth: "1400px",
  margin: "6em auto 0",
  gap: "2em",
});

const MainContent = styled("div")({
  flex: 1,
  width: "850px",
  display: "flex",
  flexDirection: "column",
  gap: "2em",
});

const BannerBox = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
});

const ViewCommunity: React.FC = () => {
  const { communityId } = useParams();
  const [viewStates, _] = useState<Record<string, string>> ({});
  const [community, setCommunity] = useState<communityStructure> ();
  const [viewImageUploader, setViewImageUplaoder] = useState<boolean> (false);
  const [communityProfilePicture, setCommunityProfilePicture] = useState<string | null> (null);
  const [communityBanner, setCommunityBanner] = useState<string | null> (null);
  const {communityData, setJoinedCommunities,setCommunityData } = useCommunity();
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>();

  const isAdmin =
    community?.members?.some(
      (member: SimpleMember) =>
        member.user === localStorage.getItem("id") && member.role === "admin"
    ) || false;

  useEffect(() => {
    const foundCommunity = communityData.find(
      (community) => community._id === communityId
    );

    if (foundCommunity) {
      setCommunity(foundCommunity);
      // if user is admin, ensure they're in joinedCommunities
      if (isAdmin && communityId) {
        setJoinedCommunities((prev) => {
          const newSet = new Set(prev);
          newSet.add(communityId);
          return newSet;
        });
      }
    }
  }, [communityData, communityId, isAdmin]);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (community?.members) {
        try {
          const membersWithDetails = await Promise.all(
            community.members.map(async (member: SimpleMember) => {
              try {
                const response = await axios.get(
                  `${API_URL}/user/${member.user}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                return {
                  role: member.role,
                  user: response.data,
                };
              } catch (error) {
                console.error(
                  `Error fetching user details for ${member.user}:`,
                  error
                );
                return {
                  role: member.role,
                  user: {
                    _id: member.user,
                    username: "Unknown User",
                    displayName: "Unknown User",
                    email: "",
                  },
                };
              }
            })
          );
          setCommunityMembers(membersWithDetails);
        } catch (error) {
          console.error("Error fetching member details:", error);
        }
      }
    };

    fetchMemberDetails();
  }, [community?.members]);

  useEffect(() => {
    const fetchCommunityImages = async () => {
      try {
        const bannerResponse = await axios.get(
          `${API_URL}/media/get-community-banner-by-ID/${communityId}/${localStorage.getItem(
            "id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const profileResponse = await axios.get(
          `${API_URL}/media/get-community-profile-by-ID/${communityId}/${localStorage.getItem(
            "id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setCommunityBanner(bannerResponse.data.data);
        setCommunityProfilePicture(profileResponse.data.data);
      } catch (error) {
        console.error("Error fetching community images:", error);
      }
    };

    if (communityId) {
      fetchCommunityImages();
    }
  }, [communityId]);

  const handleExitCommunity = async (userId: string) => {
    // is user an admin?
    const isUserAdmin = community?.members?.some(
      (member) => member.user === userId && member.role === "admin"
    );

    if (isUserAdmin) {
      return; // just silently return as we already show the toast in the UI
    }

    try {
      await axios.put(
        `${API_URL}/community/remove-members-by-ID`,
        {
          id: localStorage.getItem("id"),
          communityID: communityId,
          userID: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCommunityData((prev) =>
        prev.map((community) =>
          community._id === communityId
            ? {
                ...community,
                members: community.members?.filter((member) => member.user !== userId) // Remove the member by user
              }
            : community
        )
      );

      setCommunity((prevCommunity) =>
        prevCommunity
          ? {
              ...prevCommunity,
              members:
                prevCommunity.members?.filter(
                  (member: SimpleMember) => member.user !== userId
                ) ?? [],
            }
          : prevCommunity
      );

      if (typeof communityId === "string") {
        setJoinedCommunities((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(communityId);
          return updatedSet;
        });
      }
    } catch (error) {
      console.error("Error exiting community:", error);
    }
  };

  return (
    <PageContainer>
      <MainContent>
        <BannerBox>
          <CommunityBannerProfile
            communityBanner={communityBanner}
            communityProfilePicture={communityProfilePicture}
            onImageUpdate={() => setViewImageUplaoder(true)}
            isAdmin={!!isAdmin}
            communityName={community?.name}
          />
        </BannerBox>

        {viewImageUploader && (
          <ImageUploader
            communityId={communityId || "default"}
            communityBanner={communityBanner || "default"}
            communityProfilePicture={communityProfilePicture || "default"}
            setCommunityBanner={setCommunityBanner}
            setCommunityProfilePicture={setCommunityProfilePicture}
            setViewImageUploader={setViewImageUplaoder}
          />
        )}

        <Box>
          <PostList postIds={community?.posts || []} viewStates={viewStates} />
        </Box>
      </MainContent>

      {community?.posts && community?.links && communityMembers && (
        <CommunityInfo
          communityBanner={communityBanner}
          communityId={communityId}
          name={community?.name}
          description={community?.description}
          postLength={community?.posts.length}
          membersLength={communityMembers.length}
          createdAt={community?.createdAt}
          links={community?.links}
          onImageUpdate={() => setViewImageUplaoder(true)}
          isAdmin={!!isAdmin}
          members={communityMembers}
          setCreatePost={() => {}}
          handleExitCommunity={handleExitCommunity}
        />
      )}
    </PageContainer>
  );
};

export default ViewCommunity;
