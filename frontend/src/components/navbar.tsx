/**
 * Navigation bar component that appears at the top of all authenticated pages.
 * Features: App logo, community search, notifications, user profile menu,
 * and mobile-responsive sidebar navigation.
 */

import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  ListItem,
  Popover,
  Drawer,
  List,
  ListItemText,
  Autocomplete,
  TextField,
  Paper,
} from "@mui/material";
import FAQ from "./faq";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import ListItemButton from "@mui/material/ListItemButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { UserContext, WebSocketContext } from "../store";
import { useCommunity } from "../context/communityContext";
import { styled } from "@mui/material/styles";
import { usePost } from "../context/postContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import axios from "axios";
import { API_URL } from "../App";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import logo from "../assets/logo.png";

interface CommunityOption {
  _id: string;
  name: string;
  description: string;
  bannerUrl?: string;
}

const StyledAutocomplete = styled(Autocomplete<CommunityOption>)(() => ({
  width: "50%",
  "& .MuiInputBase-root": {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "2px 12px",
    "&:hover": {
      backgroundColor: "#eeeeee",
    },
    "& input": {
      padding: "8px 0 !important",
      color: "#666",
      "&::placeholder": {
        color: "#999",
      },
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));

const StyledPaper = styled(Paper)((_) => ({
  backgroundColor: "#fff",
  marginTop: "4px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  "& .MuiAutocomplete-option": {
    padding: "8px 16px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    '&[aria-selected="true"]': {
      backgroundColor: "#e3f2fd",
    },
  },
}));

const Navbar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, id, token } = useAuth();
  const userInfo = useContext(UserContext);
  const { communityData } = useCommunity();
  const [searchValue, setSearchValue] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [notification, setNotification] = useState<any[]>([]);
  const { websocket } = useContext(WebSocketContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAllAsRead = async () => {
    const url = `${API_URL}/notification/set-all-user-notification-as-read`;

    try {
      await axios.put(
        url,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotification([]);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAsRead = async (notificationID: string) => {
    // Prepare the API request
    const url = `${API_URL}/notification/set-notification-as-read`;

    try {
      await axios.post(
        url,
        {
          id: id,
          notificationId: notificationID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotification((prevNotifications) =>
        prevNotifications.filter((notify) => notify._id !== notificationID)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const open = Boolean(anchorEl);

  const { profilePicture } = usePost();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsDrawerOpen(open);
    };

  const handleCommunitySelect = (community: CommunityOption | null) => {
    if (community) {
      navigate(`/explore-community/${community._id}`);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const url = `${API_URL}/notification/get-notifications/${id}`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotification(res.data);
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };

    fetchNotifications(); // Call the async function inside useEffect
  }, [websocket.lastJsonMessage]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: "#666" }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 2,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="Yapple Logo"
                style={{
                  height: "32px",
                  width: "auto",
                  marginRight: "8px",
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: "#2c2c2c",
                  fontWeight: 600,
                }}
              >
                Yapple
              </Typography>
            </Box>
          </Box>

          {/* Center Section - Autocomplete */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StyledAutocomplete
              options={communityData}
              getOptionLabel={(option) => option.name}
              inputValue={searchValue}
              onInputChange={(_, newValue) => setSearchValue(newValue)}
              onChange={(_, newValue) => handleCommunitySelect(newValue)}
              PaperComponent={(props) => <StyledPaper {...props} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search communities..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <SearchIcon sx={{ color: "#999", mr: 1 }} />
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Avatar
                      src={`${API_URL}/${option.bannerUrl}`}
                      sx={{
                        width: 24,
                        height: 24,
                        mr: 1,
                        bgcolor: "primary.main",
                        fontSize: "0.875rem",
                      }}
                    >
                      {option.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">./{option.name}</Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: "400px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            />
          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/create")}
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#FF4B2B",
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                "&:hover": {
                  backgroundColor: "#FF3517",
                },
              }}
            >
              Create
            </Button>

            <IconButton onClick={handleClick}>
              {notification.length > 0 ? (
                // Icon for notifications when there are new ones
                <NotificationsActiveIcon sx={{ color: "red" }} />
              ) : (
                // Icon when there are no new notifications
                <NotificationsIcon sx={{ color: "#666" }} />
              )}
            </IconButton>

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{
                transform: "translateY(15px)",
                minWidth: "3500px",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              <Typography
                sx={{
                  p: 2,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Notifications
                <Button size="small" color="primary" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </Typography>
              <List>
                {notification?.length > 0 ? (
                  notification.map((notify) => (
                    <ListItem
                      component="div"
                      key={notify._id}
                      onClick={() =>
                        navigate("/post/" + notify.relatedEntity._id)
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <Avatar
                        src={`${API_URL}/${notify?.actor?.profilePictureUrl}`} // Removed extra {}
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#f0f0f0",
                          cursor: "pointer",
                          color: "#2c2c2c",
                        }}
                      ></Avatar>
                      <ListItemText
                        primary={`${notify.actor?.displayName} has ${
                          notify.notificationType === "new_vote"
                            ? "voted"
                            : "commented"
                        } on your post`}
                      />
                      <IconButton onClick={() => markAsRead(notify._id)}>
                        <CheckCircleIcon sx={{ color: "#4caf50" }} />
                      </IconButton>
                    </ListItem>
                  ))
                ) : (
                  <Typography sx={{ p: 2, textAlign: "center", color: "gray" }}>
                    No new notifications
                  </Typography>
                )}
              </List>
            </Popover>

            <FAQ />

            <Button
              onClick={() => navigate(`/user-page/${id}`)}
              sx={{
                minWidth: "auto",
                p: 0.5,
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <Avatar
                src={profilePicture}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#f0f0f0",
                  color: "#2c2c2c",
                }}
              >
                {userInfo?.displayName?.[0]?.toUpperCase()}
              </Avatar>
            </Button>

            <Button
              variant="outlined"
              onClick={logout}
              sx={{
                ml: 1,
                color: "#666",
                borderColor: "#ccc",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            marginTop: "64px",
            height: "calc(100vh - 64px)",
            width: "280px",
            borderRight: "1px solid #eee",
          },
        }}
      >
        <Box
          sx={{ width: "100%" }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItemButton
              onClick={() => navigate("/explore-posts")}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemText
                primary="Explore Posts"
                primaryTypographyProps={{
                  sx: { color: "#2c2c2c", fontWeight: 500 },
                }}
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => navigate("/explore-community")}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemText
                primary="Explore Communities"
                primaryTypographyProps={{
                  sx: { color: "#2c2c2c", fontWeight: 500 },
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
