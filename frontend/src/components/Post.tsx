/**
 * Reusable post component used throughout the application.
 * Displays post content, handles voting, comments, sharing, and post management.
 * Features: Media preview, vote counts, expiry timers, and interactive actions.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../context/postContext";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
} from "@mui/material";
import {
  Comment,
  MoreHoriz,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Lock,
  Share,
  WhatsApp,
  Mail,
  ContentCopy,
  Close,
} from "@mui/icons-material";
import { PostData } from "../pages/user-page/types";
import { API_URL } from "../App";
import { generateDateString } from "../pages/user-page/helpers";
import Bomb from "../assets/bomb.png";
import style from "./Post.module.css";
import axios from "axios";
import { useAuth } from "../hooks";
import { DateTime } from "luxon";
import ImageModal from "./ImageModal";

const PostComponent: React.FC<
  PostData & {
    onDelete?: () => void;
    isPreview?: boolean;
  }
> = ({ onDelete, isPreview = false, ...postData }) => {
  const { id, token } = useAuth();
  const navigate = useNavigate();
  const [isShown, setIsShown] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [voteData, setVoteData] = useState<{
    upvotes: number;
    downvotes: number;
    total: number;
    votes: Array<{
      _id: string;
      user: string;
      targetModel: string;
      targetId: string;
      voteType: "upvote" | "downvote";
      createdAt: string;
    }>;
  } | null>(null);
  const open = Boolean(anchorEl);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const postUrl = `${window.location.origin}/post/${postData._id}`;
  const {profilePicture} = usePost();

  const fetchVotes = async () => {
    try {
      const url = `${API_URL}/vote/get-votes/Post/${postData._id}?id=${id}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVoteData(res.data.data);
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  // fetch votes when component mounts
  useEffect(() => {
    if (!isPreview) {
      fetchVotes();
    }
  }, [postData._id, isPreview]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleClose();
    onDelete?.();
  };

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isPreview) return;
    if (event.currentTarget.classList.contains("clickable-area")) {
      navigate(`/post/${postData._id}`);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreview) {
      setImageModalOpen(true);
    }
  };

  const hasMedia = postData.body?.image !== undefined;
  const isTimeCapsule = postData.postType === "timeCapsule";
  const isSelfDestruct = postData.postType === "selfDestruct";
  const revealTime = postData.revealAt
    ? DateTime.fromISO(postData.revealAt.toString())
    : null;
  const expiryTime = postData.expiresAt
    ? DateTime.fromISO(postData.expiresAt.toString())
    : null;
  const timeNow = DateTime.now();

  const getTimeRemaining = () => {
    if (!revealTime || !timeNow) return "";
    try {
      const diff = revealTime
        .diff(timeNow, ["days", "hours", "minutes"])
        .toObject();
      if (!diff.days && !diff.hours && !diff.minutes) return "Soon";
      return `${Math.max(0, Math.floor(diff.days || 0))}d ${Math.max(
        0,
        Math.floor(diff.hours || 0)
      )}h ${Math.max(0, Math.floor(diff.minutes || 0))}m`;
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return "Soon";
    }
  };

  const getExpiryTimeRemaining = () => {
    if (!expiryTime || !timeNow) return "";
    try {
      const diff = expiryTime
        .diff(timeNow, ["days", "hours", "minutes"])
        .toObject();
      if (!diff.days && !diff.hours && !diff.minutes) return "Soon";
      return `${Math.max(0, Math.floor(diff.days || 0))}d ${Math.max(
        0,
        Math.floor(diff.hours || 0)
      )}h ${Math.max(0, Math.floor(diff.minutes || 0))}m`;
    } catch (error) {
      console.error("Error calculating expiry time:", error);
      return "Soon";
    }
  };

  const isRevealTimeInPast = (reveal: DateTime | null) => {
    if (!reveal) return true;
    return reveal <= timeNow;
  };

  useEffect(() => {
    if (!isTimeCapsule || !revealTime || isRevealTimeInPast(revealTime)) {
      setIsShown(true);
      return;
    }

    const remainingTime = revealTime.diff(timeNow).milliseconds;

    const id = setTimeout(() => {
      setIsShown(true);
    }, remainingTime);

    return () => {
      clearTimeout(id);
    };
  }, [postData, revealTime, timeNow, isTimeCapsule]);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (isPreview) return;
    try {
      await axios.post(
        `${API_URL}/vote/create`,
        {
          id: id,
          targetId: postData._id,
          targetModel: "Post",
          voteType: voteType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // fetch fresh vote data after voting
      fetchVotes();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // get the user's current vote if any
  const userVote = voteData?.votes.find((v) => v.user === id)?.voteType;

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, "_blank");
  };

  const handleEmailShare = () => {
    window.open(
      `mailto:?subject=Interessanter Post&body=${encodeURIComponent(postUrl)}`
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 2000);
  };

  const isOwner = postData?.author?._id === id;

  return (
    <>
      <Card
        className={isShown ? style.show : style.blury}
        sx={{
          width: isPreview ? "100%" : "75%",
          margin: isPreview ? "0" : "1em auto",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          backgroundColor: "#fff",
          position: "relative",
          transition: "box-shadow 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1.25em",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();

              if (!isPreview) {
                navigate(`/user-page/${postData?.author?._id}`);
              }
            }}
            sx={{
              minWidth: "auto",
              p: 0,
              mr: 2,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
          
          {isOwner && <Avatar
            src={profilePicture} // Removed extra {}
            sx={{
              width: 42,
              height: 42,
              backgroundColor: "#f0f0f0",
              cursor: 'pointer',
              color: '#2c2c2c'
            }}
          >
            {postData?.author?.displayName?.[0]?.toUpperCase()}
          </Avatar>
          }
          
          {!isOwner && <Avatar
            src={`${API_URL}/${postData?.author?.profilePictureUrl}`} // Removed extra {}
            sx={{
              width: 42,
              height: 42,
              backgroundColor: "#f0f0f0",
              cursor: 'pointer',
              color: '#2c2c2c'
            }}
          >
            {postData?.author?.displayName?.[0]?.toUpperCase()}
          </Avatar>
          }
          </Button>

          <Box>
            <Button
              onClick={(e) => {
                e.stopPropagation();

                if (!isPreview) {
                  // navigate(`/user-page/${postData?.author.id}`);
                }
              }}
              sx={{
                p: 0,
                textAlign: "left",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Typography
                variant="h6"
                component="span"
                onClick={() => navigate(`/user-page/${postData?.author?._id}`)}
                sx={{ 
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#2c2c2c",
                  cursor: "pointer", // Ensures it's visually clickable
                  '&:hover': {
                    color: '#FF4B2B',
                  },
                }}
              >
                {postData?.author?.username}
              </Typography>

            </Button>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "0.875rem",
              }}
            >
              {generateDateString(postData.createdAt!)}
            </Typography>
          </Box>

          {!isPreview && (
            <IconButton
              onClick={handleClick}
              sx={{ marginLeft: "auto", color: "#757575" }}
            >
              <MoreHoriz />
            </IconButton>
          )}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleShare} sx={{ color: "#666" }}>
              <Share sx={{ mr: 1 }} />
              Share
            </MenuItem>
            {isOwner && (
              <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                <Delete sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            )}
          </Menu>
        </CardContent>

        <CardContent sx={{ pt: 2, pb: 1.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: "1.35rem",
              color: "#2c2c2c",
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {postData.title}
          </Typography>
        </CardContent>

        {isTimeCapsule && !isShown ? (
          <>
            {/* Empty container to maintain card height */}
            <Box
              sx={{
                minHeight: "200px",
                position: "relative",
                backgroundColor: "#f5f5f5",
              }}
            >
              {/* Overlay with lock icon and text */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "#666",
                  backgroundColor: "rgba(245, 245, 245, 0.95)",
                  padding: "2em",
                  borderRadius: "8px",
                  zIndex: 2,
                  width: "80%",
                  maxWidth: "500px",
                }}
              >
                <Lock sx={{ fontSize: 60, mb: 2, color: "#999" }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Time Capsule: This post is currently locked
                </Typography>
                <Typography>
                  Time remaining until reveal: {getTimeRemaining()}
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <>
            {/* Show media first if it exists */}
            {hasMedia && (
              <Box sx={{ padding: "12px" }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={
                    isPreview
                      ? (postData.body?.image as string)
                      : `${API_URL}/${postData.body?.image}`
                  }
                  alt="Post media"
                  onClick={handleImageClick}
                  sx={{
                    objectFit: "cover",
                    borderRadius: "8px",
                    width: "100%",
                    height: "300px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.01)",
                    },
                  }}
                />
              </Box>
            )}

            {/* Show text content below */}
            <CardContent
              className="clickable-area"
              onClick={handleCardClick}
              sx={{
                padding: "1.25em 1.5em",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#fafafa",
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "#444",
                }}
              >
                {postData.body?.text || "No content available."}
              </Typography>
            </CardContent>
          </>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f0f0f0",
            padding: "0.75em 1.25em",
            backgroundColor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              sx={{
                color: userVote === "upvote" ? "#FF4B2B" : "#757575",
                padding: "6px",
              }}
              onClick={() => handleVote("upvote")}
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                minWidth: "2em",
                textAlign: "center",
                color: "#666",
                fontWeight: 500,
              }}
            >
              {voteData?.total || 0}
            </Typography>
            <IconButton
              sx={{
                color: userVote === "downvote" ? "#FF4B2B" : "#757575",
                padding: "6px",
              }}
              onClick={() => handleVote("downvote")}
            >
              <ArrowDownward fontSize="small" />
            </IconButton>
          </Box>
          <IconButton
            className="clickable-area"
            onClick={handleCardClick}
            sx={{
              color: "#666",
              padding: "6px",
            }}
          >
            <Comment fontSize="small" />
            <Typography
              variant="body2"
              sx={{
                marginLeft: "0.5em",
                color: "#666",
                fontWeight: 500,
              }}
            >
              {postData.comments?.length || 0}
            </Typography>
          </IconButton>
        </Box>

        {isSelfDestruct && expiryTime && (
          <Tooltip
            title={
              <Box>
                <Typography variant="body2">
                  Expires in: {getExpiryTimeRemaining()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {`(${expiryTime.toLocaleString(DateTime.DATETIME_FULL)})`}
                </Typography>
              </Box>
            }
            placement="top"
          >
            <img
              src={Bomb}
              alt="Self-destruct post"
              style={{
                position: "absolute",
                left: "50%",
                bottom: "12px",
                transform: "translateX(-50%)",
                width: "28px",
                height: "28px",
                cursor: "help",
                opacity: 0.8,
              }}
            />
          </Tooltip>
        )}
      </Card>

      <ImageModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={
          isPreview
            ? (postData.body?.image as string)
            : `${API_URL}/${postData.body?.image}`
        }
      />

      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm" // Adjust the size of the dialog (options: 'xs', 'sm', 'md', 'lg', 'xl')
        fullWidth // Makes the dialog take up more horizontal space
      >
        <DialogTitle>
          Teilen
          <IconButton
            onClick={() => setShareDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px", // Increased gap for better spacing
              padding: "16px", // Added padding for better visual appeal
            }}
          >
            <IconButton
              onClick={handleWhatsAppShare}
              sx={{
                color: "#25D366",
                fontSize: "1.1rem",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(37, 211, 102, 0.1)",
                  borderRadius: "0",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <WhatsApp sx={{ marginRight: "8px" }} /> WhatsApp
            </IconButton>
            <IconButton
              onClick={handleEmailShare}
              sx={{
                color: "#EA4335",
                fontSize: "1.1rem",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(234, 67, 53, 0.1)",
                  borderRadius: "0",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Mail sx={{ marginRight: "8px" }} /> E-Mail
            </IconButton>
            <IconButton
              onClick={handleCopyLink}
              sx={{
                color: "#666",
                fontSize: "1.1rem",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(102, 102, 102, 0.1)",
                  borderRadius: "0",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <ContentCopy sx={{ marginRight: "8px" }} /> Link kopieren
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        message="Link wurde in die Zwischenablage kopiert"
        autoHideDuration={2000}
      />
    </>
  );
};

export default PostComponent;
