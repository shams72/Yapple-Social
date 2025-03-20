import { FC, useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Stack,
  styled,
  Skeleton,
} from "@mui/material";
import CakeIcon from "@mui/icons-material/Cake";
import axios from "axios";
import { UserContext } from "../../../store";
import { API_URL } from "../../../App";
import { useAuth } from "../../../hooks";
import { useParams } from "react-router-dom";
import { EditProfileModal } from "./EditProfileModal";

interface GeneralInfoProps {
  className?: string;
}

interface UserStats {
  postCount: number;
  commentsCount: number;
  isLoading: boolean;
  error: string | null;
}

const defaultBannerLink =
  "https://th.bing.com/th/id/OIP.VoXO6QAJnMcud_Oig38WBQHaB2?rs=1&pid=ImgDetMain";

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
  marginBottom: "1rem",
  borderRadius: "8px",
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },
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

export const GeneralInfo: FC<GeneralInfoProps> = ({ className }) => {
  const [stats, setStats] = useState<UserStats>({
    postCount: 0,
    commentsCount: 0,
    isLoading: true,
    error: null,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userCtx = useContext(UserContext);
  const { id, token } = useAuth();
  const profileId = useParams()["id"];
  const isLoggedUser = id === profileId;

  const imageBannerRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    async function fetchUserStats() {
      try {
        const res = await axios.get(
          `${API_URL}/posts/get-user-post-count/${profileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const commentsCountRes = await axios.get(
          `${API_URL}/comment/comment-count/${profileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const commentsCount = commentsCountRes.data.commentCount;

        setStats((prev) => ({
          ...prev,
          postCount: res.data,
          commentsCount: commentsCount,
          isLoading: false,
        }));
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load user stats",
        }));
      }
    }

    fetchUserStats();
  }, [profileId, token]);

  if (!userCtx) {
    return <Skeleton variant="rectangular" height={400} />;
  }

  return (
    <>
      <StyledAside elevation={3} className={className}>
        <BannerContainer>
          <img
            ref={imageBannerRef}
            src={
              userCtx.bannerPictureUrl
                ? `${API_URL}/${userCtx.bannerPictureUrl}`
                : defaultBannerLink
            }
            alt="Profile banner"
          />
        </BannerContainer>

        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {userCtx.displayName}
            </Typography>
            {userCtx.bio && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: "white",
                  opacity: 0.8,
                }}
              >
                {userCtx.bio}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CakeIcon fontSize="small" />
            <Typography variant="body2">
              Joined {new Date(userCtx.joinedAt).toLocaleDateString()}
            </Typography>
          </Box>

          {stats.isLoading ? (
            <Skeleton variant="rectangular" height={100} />
          ) : (
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
                <Typography variant="h6">{stats.postCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Posts
                </Typography>
              </StatBox>
              <Divider orientation="vertical" flexItem />
              <StatBox>
                <Typography variant="h6">{stats.commentsCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Comments
                </Typography>
              </StatBox>
            </Box>
          )}

          {isLoggedUser && (
            <>
              <Divider />
              <Button
                variant="contained"
                fullWidth
                onClick={() => setIsEditModalOpen(true)}
                sx={{
                  borderRadius: "2em",
                  backgroundColor: "grey.700",
                  "&:hover": {
                    backgroundColor: "grey.600",
                  },
                }}
              >
                Edit Profile
              </Button>
            </>
          )}

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
             
            </Typography>
            <Stack spacing={1}>
              {userCtx.links?.map((link, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  component="a"
                  href={link}
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
                  {link}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </StyledAside>

      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};
