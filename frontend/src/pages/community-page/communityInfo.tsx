/**
 * Sidebar component displaying community details, stats, and member list.
 */

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Stack,
  styled,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AddLinkIcon from "@mui/icons-material/AddLink";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import EditIcon from "@mui/icons-material/Edit";
import AddLinks from "./addLinks";
import { useCommunity } from "../../context/communityContext";
import axios from "axios";
import { API_URL } from "../../App";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { EditCommunityModal } from "./editCommunityModal";
import { useAuth } from "../../hooks";

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

interface CommunityInfoProps {
  communityBanner :string|null,
  communityId?: string;
  name?: string;
  description?: string;
  postLength?: number;
  membersLength?: number;
  createdAt: string;
  links: { platform: string; url: string }[];
  onImageUpdate?: () => void;
  isAdmin?: boolean;
  members?: CommunityMember[];
  setCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
  handleExitCommunity: (userId: string) => void;
}

const StyledAside = styled(Paper)(({ theme }) => ({
  width: "300px",
  backgroundColor: "rgb(60, 60, 60)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  position: "sticky",
  top: theme.spacing(2),
  color: theme.palette.common.white,
  boxShadow: "-1px 0 15px rgba(0, 0, 0, 0.5)",
  minHeight: "75vh",
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const BannerContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "160px",
  borderRadius: "8px",
  overflow: "hidden",
  marginBottom: "1rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
});

const Banner = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const StatBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(1),
  flex: 1,
  "&:hover": {
    backgroundColor: theme.palette.grey[800],
    borderRadius: theme.spacing(1),
    cursor: "pointer",
  },
}));

const defaultBannerLink =
  "https://th.bing.com/th/id/OIP.VoXO6QAJnMcud_Oig38WBQHaB2?rs=1&pid=ImgDetMain";

const CommunityInfo: React.FC<CommunityInfoProps> = ({
  communityBanner,
  communityId,
  name,
  description,
  postLength = 0,
  membersLength = 0,
  createdAt,
  links,
  onImageUpdate,
  isAdmin,
  members = [],
  setCreatePost,
  handleExitCommunity,
}) => {
  const [linkBox, setLinkBox] = useState(false);
  const { admin, joinedCommunities, setJoinedCommunities, setCommunityData } = useCommunity();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  setCreatePost;

  const { id } = useAuth();
  

  const handleCreatePost = () => {
    navigate("/create", { state: { communityId } });
  };

  const handleJoinCommunity = async () => {
    if (isAdmin) {
      showToast("You are already an admin of this community!", "info");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/community/add-members-by-ID`,
        {
          id: localStorage.getItem("id"),
          communityID: communityId,
          userID: localStorage.getItem("id"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        if (communityId) {
          setCommunityData((prev) =>
            prev.map((community) =>
              community._id === communityId
                ? {
                    ...community,
                    members: [...(community.members ?? []), { role: "member", user: String(id) }] // Push new member to members
                  }
                : community
            )
          );

          setJoinedCommunities((prev) => {
            const newSet = new Set(prev);
            newSet.add(communityId);
            return newSet;
          });
        }
        showToast("Successfully joined community!", "success");
      }
    } catch (error) {
      showToast("Failed to join community", "error");
    }
  };

  const handleExitCommunityClick = () => {
    if (isAdmin) {
      showToast("Admins cannot leave the community!", "error");
      return;
    }
    handleExitCommunity(localStorage.getItem("id") || "default");
  };

  const handleEditCommunity = () => {
    setShowEditModal(true);
  };

  return (
    <StyledAside elevation={3}>
      <Stack spacing={2}>
        <BannerContainer>
        <Banner 
          src={communityBanner ? communityBanner : defaultBannerLink} 
          alt="Community banner" 
        />

        {isAdmin && (
            <IconButton
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
              }}
              onClick={onImageUpdate}
            >
              <UploadRoundedIcon sx={{ color: "white" }} />
            </IconButton>
          )}
        </BannerContainer>

        <Typography variant="h5" gutterBottom>
          ./{name}
        </Typography>

        <Typography variant="body1" sx={{ color: "white" }} gutterBottom>
          {description}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupIcon fontSize="small" />
          <Typography variant="body2">
            Created {new Date(createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Stack spacing={1}>
          {isAdmin ? (
            <>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCreatePost}
                startIcon={<PostAddIcon />}
                sx={{ borderRadius: 2 }}
              >
                Create Post
              </Button>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleEditCommunity}
                startIcon={<EditIcon />}
                sx={{ borderRadius: 2 }}
              >
                Edit Community
              </Button>
            </>
          ) : !joinedCommunities.has(communityId || "") ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleJoinCommunity}
              sx={{ borderRadius: 2 }}
            >
              Join Community
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCreatePost}
                startIcon={<PostAddIcon />}
                sx={{ borderRadius: 2 }}
              >
                Create Post
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleExitCommunityClick}
                startIcon={<ExitToAppIcon />}
                sx={{ borderRadius: 2 }}
              >
                Leave Community
              </Button>
            </>
          )}
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <StatBox>
            <Typography variant="h6">{postLength}</Typography>
            <Typography variant="body2" color="text.secondary">
              Posts
            </Typography>
          </StatBox>
          <Divider orientation="vertical" flexItem />
          <StatBox>
            <Typography variant="h6">{membersLength}</Typography>
            <Typography variant="body2" color="text.secondary">
              Members
            </Typography>
          </StatBox>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Members
          </Typography>
          <List
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 2,
              maxHeight: "300px",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.3)",
                },
              },
            }}
          >
            {members?.map((member, index) => (
              <ListItem
                key={index}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  borderRadius: 1,
                  mb: 0.5,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/user-page/${member.user._id}`)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={member.user.profilePictureUrl ? `${API_URL}/${member.user.profilePictureUrl}` : undefined}
                   
                    sx={{
                      bgcolor:
                        member.role === "admin"
                          ? "primary.main"
                          : "secondary.main",
                    }}
                  >
                    {member.user.displayName.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.user.displayName}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        @{member.user.username}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color:
                            member.role === "admin"
                              ? "primary.main"
                              : "text.secondary",
                          fontWeight: member.role === "admin" ? 600 : 400,
                        }}
                      >
                        {member.role.charAt(0).toUpperCase() +
                          member.role.slice(1)}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6">Links</Typography>
            {communityId && admin.has(communityId) && (
              <Button
                onClick={() => setLinkBox(true)}
                startIcon={<AddLinkIcon />}
                sx={{ color: "white" }}
              >
                Add Link
              </Button>
            )}
          </Box>
          <Stack spacing={1}>
            {links?.map((link, index) => (
              <Typography
                key={index}
                variant="body2"
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {link.platform}: {link.url}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Stack>

      {linkBox && (
        <AddLinks
          setLinkBox={setLinkBox}
          communityID={communityId}
          links={links}
        />
      )}

      {showEditModal && (
        <EditCommunityModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          communityId={communityId || ""}
          currentName={name || ""}
          currentDescription={description || ""}
          links={links}
        />
      )}
    </StyledAside>
  );
};

export default CommunityInfo;
