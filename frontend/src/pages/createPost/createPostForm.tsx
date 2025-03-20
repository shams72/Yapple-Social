import React, { ChangeEvent, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import ImageIcon from "@mui/icons-material/Image";
import { useCommunity } from "../../context/communityContext";
import { useNavigate } from "react-router-dom";

// interface Community {
//   _id: string;
//   name: string;
//   description: string;
// }

interface CreatePostFormProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setPostBody: React.Dispatch<React.SetStateAction<string>>;
  handleUploadPreview: (e: ChangeEvent<HTMLInputElement>) => void;
  postType: string;
  setPostType: React.Dispatch<React.SetStateAction<string>>;
  revealAt: DateTime | null;
  setRevealAt: React.Dispatch<React.SetStateAction<DateTime | null>>;
  expiresAt: DateTime | null;
  setExpiresAt: React.Dispatch<React.SetStateAction<DateTime | null>>;
  setCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateNormalPost: () => void;
  handleSelfDestructPost: () => void;
  handleTimeCapsulePost: () => void;
  selectedCommunity?: string;
  setSelectedCommunity: React.Dispatch<React.SetStateAction<string>>;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  setTitle,
  setPostBody,
  handleUploadPreview,
  postType,
  setPostType,
  revealAt,
  setRevealAt,
  expiresAt,
  setExpiresAt,
  handleCreateNormalPost,
  handleSelfDestructPost,
  handleTimeCapsulePost,
  selectedCommunity,
  setSelectedCommunity,
}) => {
  const now = DateTime.now();
  const tomorrow = now.plus({ days: 1 });
  const { communityData, refreshCommunities } = useCommunity();
  const navigate = useNavigate();

  useEffect(() => {
    refreshCommunities(); // refresh community data when form loads
  }, []);

  const formFieldSx = {
    mb: 2,
    width: "100%",
  };

  return (
    <div className="create-post-form">
      <form>
        <Typography variant="h5" sx={{ mb: 3, color: "#333", fontWeight: 500 }}>
          Make a New Post
        </Typography>

        <Autocomplete
          options={communityData}
          getOptionLabel={(option) => option.name}
          value={communityData.find((c) => c._id === selectedCommunity) || null}
          onChange={(_, newValue) => setSelectedCommunity(newValue?._id || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Community (Optional)"
              variant="outlined"
            />
          )}
          sx={{
            width: "100%",
            mb: 2,
            "& .MuiOutlinedInput-root": {
              width: "100%",
            },
          }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 2, mt: -1 }}
        >
          If no community is selected, this will be posted to your personal
          profile
        </Typography>

        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={formFieldSx}
        />

        <TextField
          label="Post Content"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          onChange={(e) => setPostBody(e.target.value)}
          required
          sx={formFieldSx}
        />

        <FormControl fullWidth sx={formFieldSx}>
          <InputLabel>Post Type</InputLabel>
          <Select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            label="Post Type"
          >
            <MenuItem value="normal">Standard Post</MenuItem>
            <MenuItem value="selfDestruct">Self Destruct Post</MenuItem>
            <MenuItem value="timeCapsule">Time Capsule Post</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={formFieldSx}>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadPreview}
            style={{
              display: "none",
            }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<ImageIcon />}
              sx={{
                height: "56px",
                borderColor: "#ccc",
                color: "#666",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Upload Image
            </Button>
          </label>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterLuxon}>
          {postType === "timeCapsule" && (
            <DateTimePicker
              label="Reveal At"
              value={revealAt}
              onChange={(newValue) => {
                setRevealAt(newValue);
                if (newValue) {
                  setExpiresAt(newValue.plus({ years: 100 }));
                }
              }}
              minDateTime={tomorrow}
              sx={formFieldSx}
              slotProps={{
                textField: {
                  helperText: "When should this post become visible?",
                  fullWidth: true,
                },
              }}
            />
          )}

          {postType === "selfDestruct" && (
            <DateTimePicker
              label="Expires At"
              value={expiresAt}
              onChange={(newValue) => setExpiresAt(newValue)}
              minDateTime={now}
              sx={formFieldSx}
              slotProps={{
                textField: {
                  helperText: "When should this post expire?",
                  fullWidth: true,
                },
              }}
            />
          )}
        </LocalizationProvider>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                // Reset all form fields
                setTitle("");
                setPostBody("");
                setPostType("");
                setRevealAt(null);
                setExpiresAt(null);
                setSelectedCommunity("");
                navigate("/explore-posts");
                return;
              }}
              sx={{
                height: "45px",
                borderColor: "#ccc",
                color: "#666",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                height: "45px",
                backgroundColor: "#FF4B2B",
                "&:hover": {
                  backgroundColor: "#FF3517",
                },
              }}
              onClick={() => {
                navigate(-1);
                postType === "normal"
                  ? handleCreateNormalPost()
                  : postType === "selfDestruct"
                  ? handleSelfDestructPost()
                  : postType === "timeCapsule"
                  ? handleTimeCapsulePost()
                  : () => console.error("Unknown post type");

                navigate("/explore-posts");
               
              }}
            >
              Create Post
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreatePostForm;
