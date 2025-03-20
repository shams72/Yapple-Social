/**
 * Displays community banner and profile picture with admin edit capabilities.
 */

import React from "react";
import { Box, styled, IconButton, Avatar } from "@mui/material";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";

interface CommunityBannerProfileProps {
  communityBanner: string | null;
  communityProfilePicture: string | null;
  onImageUpdate: () => void;
  isAdmin: boolean;
  communityName?: string;
}

const BannerContainer = styled(Box)({
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "2rem",
});

const Banner = styled("div")({
  width: "95%",
  height: "300px",
  position: "relative",
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: "#f0f2f5",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const ProfilePicture = styled(Box)({
  position: "absolute",
  left: "8%",
  bottom: "20px",
  width: "120px",
  height: "120px",
  border: "4px solid #fff",
  borderRadius: "50%",
  backgroundColor: "#f0f2f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const StyledAvatar = styled(Avatar)({
  width: "100%",
  height: "100%",
  fontSize: "3rem",
  backgroundColor: "#1976d2",
  color: "#fff",
});

const defaultBannerLink =
  "https://th.bing.com/th/id/OIP.VoXO6QAJnMcud_Oig38WBQHaB2?rs=1&pid=ImgDetMain";
defaultBannerLink;

const CommunityBannerProfile: React.FC<CommunityBannerProfileProps> = ({
  communityProfilePicture,
  communityBanner,
  onImageUpdate,
  isAdmin,
  communityName = "C",
}) => {
  return (
    <BannerContainer>
      <Banner>
        {communityBanner ? (
          <img src={communityBanner} alt="Community Banner" />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f0f2f5",
              color: "text.secondary",
              fontSize: "1.25rem",
            }}
          >
            Community Banner
          </Box>
        )}
        <ProfilePicture>
          {communityProfilePicture ? (
            <img src={communityProfilePicture} alt="Community Profile" />
          ) : (
            <StyledAvatar>{communityName.charAt(0).toUpperCase()}</StyledAvatar>
          )}
        </ProfilePicture>
        {isAdmin && (
          <IconButton
            sx={{
              position: "absolute",
              bottom: 8,
              right: "5%",
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
      </Banner>
    </BannerContainer>
  );
};

export default CommunityBannerProfile;
