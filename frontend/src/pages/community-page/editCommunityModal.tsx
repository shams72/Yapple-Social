/**
 * Modal for editing community settings, images, and platform links.
 */

import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  styled,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { API_URL } from "../../App";
import { useAuth } from "../../hooks";
import { toastContext } from "../../store";
import { useCommunity } from "../../context/communityContext";

interface EditCommunityModalProps {
  open: boolean;
  onClose: () => void;
  communityId: string;
  currentName: string;
  currentDescription: string;
  links: Array<{ platform: string; url: string }>;
}

interface CommunityStructure {
  _id: string;
  name: string;
  description: string;
  links?: Array<{ platform: string; url: string }>;
  bannerUrl?: string;
  posts?: string[];
  members?: Array<{ role: string; user: string }>;
  createdAt: string;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "rgb(60, 60, 60)",
    color: theme.palette.common.white,
    minWidth: "500px",
    borderRadius: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 3),
  backgroundColor: "rgba(255, 255, 255, 0.05)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: theme.spacing(1),
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const FileUploadButton = styled("label")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: theme.spacing(1),
  cursor: "pointer",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
}));

export const EditCommunityModal: React.FC<EditCommunityModalProps> = ({
  open,
  onClose,
  communityId,
  currentName,
  currentDescription,
  links = [],
}) => {
  const { id, token } = useAuth();
  const toastCtx = useContext(toastContext);
  const { communityData, setCommunityData } = useCommunity();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: currentName || "",
        description: currentDescription || "",
      });
    }
  }, [open, currentName, currentDescription]);

  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null
  );
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(
    null
  );
  const [previewBannerUrl, setPreviewBannerUrl] = useState<string | null>(null);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
    };

    // validate community name
    if (!formData.name.trim()) {
      newErrors.name = "Community name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Community name must be at least 2 characters";
    }

    // validate description
    if (!formData.description.trim()) {
      newErrors.description = "Community description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear all error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setSelectedBannerFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPreviewBannerUrl(previewUrl);
  };

  const handleProfileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setSelectedProfileFile(e.target.files[0]);
  };

  const handleModalClose = () => {
    if (previewBannerUrl) {
      URL.revokeObjectURL(previewBannerUrl);
      setPreviewBannerUrl(null);
    }
    setSelectedBannerFile(null);
    setSelectedProfileFile(null);
    setErrors({ name: "", description: "" });
    onClose();
  };

  const uploadImage = async (
    file: File,
    type: "banner" | "profile"
  ): Promise<string | null> => {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const data = {
        id,
        uploadedBy: id,
        url: type,
        relatedObject: communityId,
        data: base64Data,
      };

      const endpoint =
        type === "banner" ? "upload-community-banner" : "upload-community-pic";

      const response = await axios.post(`${API_URL}/media/${endpoint}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        toastCtx.setOpen({
          open: true,
          message: `${type} uploaded successfully!`,
          alertColor: "success",
        });
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toastCtx.setOpen({
        open: true,
        message: `Failed to upload ${type}`,
        alertColor: "error",
      });
      throw error;
    }
  };

  const handleAddLink = async () => {
    if (!newPlatform || !newUrl) return;

    try {
      await axios.put(
        `${API_URL}/community/add-platform-links-by-ID`,
        {
          id,
          communityID: communityId,
          platform: newPlatform,
          url: newUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewPlatform("");
      setNewUrl("");

      // updates local state because the community links are not updated on the page
      const updatedCommunity = communityData.find(
        (c) => c._id === communityId
      ) as CommunityStructure | undefined;
      if (updatedCommunity) {
        updatedCommunity.links = [
          ...(updatedCommunity.links || []),
          { platform: newPlatform, url: newUrl },
        ];
        setCommunityData([...communityData]);
      }
    } catch (error) {
      toastCtx.setOpen({
        open: true,
        message: "Failed to add link",
        alertColor: "error",
      });
    }
  };

  const handleDeleteLink = async (platform: string) => {
    try {
      await axios.delete(
        `${API_URL}/community/delete-platform-from-link-by-ID`,
        {
          data: {
            id,
            communityID: communityId,
            platform,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // updates local state because the community links are not updated on the page
      const updatedCommunity = communityData.find(
        (c) => c._id === communityId
      ) as CommunityStructure | undefined;
      if (updatedCommunity) {
        updatedCommunity.links =
          updatedCommunity.links?.filter(
            (link) => link.platform !== platform
          ) || [];
        setCommunityData([...communityData]);
      }
    } catch (error) {
      toastCtx.setOpen({
        open: true,
        message: "Failed to delete link",
        alertColor: "error",
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toastCtx.setOpen({
        open: true,
        message: "Please fix the errors before saving",
        alertColor: "error",
      });
      return;
    }

    try {
      // updates the community name if changed
      if (formData.name !== currentName) {
        await axios.put(
          `${API_URL}/community/edit-community-name`,
          {
            id,
            communityID: communityId,
            currentName: currentName,
            newName: formData.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // updates the community description if changed
      if (formData.description !== currentDescription) {
        await axios.put(
          `${API_URL}/community/edit-community-description-by-ID`,
          {
            id,
            communityID: communityId,
            newDescription: formData.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Upload images if selected
      let bannerUrl = null;

      if (selectedBannerFile) {
        bannerUrl = await uploadImage(selectedBannerFile, "banner");
      }

      if (selectedProfileFile) {
        await uploadImage(selectedProfileFile, "profile");
      }

      const updatedCommunity = communityData.find(
        (c) => c._id === communityId
      ) as CommunityStructure | undefined;
      if (updatedCommunity) {
        updatedCommunity.name = formData.name;
        updatedCommunity.description = formData.description;
        if (bannerUrl) {
          updatedCommunity.bannerUrl = bannerUrl;
        }
        setCommunityData([...communityData]);
      }

      toastCtx.setOpen({
        open: true,
        message: "Community updated successfully",
        alertColor: "success",
      });

      handleModalClose();

      window.location.reload(); // simply reloads the page to reflect all changes
    } catch (error) {
      toastCtx.setOpen({
        open: true,
        message: "Failed to update community",
        alertColor: "error",
      });
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography variant="h6">Edit Community</Typography>
        <IconButton
          onClick={handleModalClose}
          size="small"
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ mb: 1.5, opacity: 0.7 }}
            >
              Banner Image
            </Typography>
            {previewBannerUrl && (
              <Box sx={{ mb: 2 }}>
                <img
                  src={previewBannerUrl}
                  alt="Banner preview"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}
            <FileUploadButton>
              <PhotoCameraIcon sx={{ color: "white" }} />
              <Typography variant="body2" sx={{ color: "white" }}>
                {selectedBannerFile ? "Change Banner" : "Upload Banner"}
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerSelect}
                style={{ display: "none" }}
              />
            </FileUploadButton>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ mb: 1.5, opacity: 0.7 }}
            >
              Profile Picture
            </Typography>
            <FileUploadButton>
              <PhotoCameraIcon sx={{ color: "white" }} />
              <Typography variant="body2" sx={{ color: "white" }}>
                {selectedProfileFile
                  ? "Change Profile Picture"
                  : "Upload Profile Picture"}
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileSelect}
                style={{ display: "none" }}
              />
            </FileUploadButton>
          </Box>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ mb: 1.5, opacity: 0.7 }}
            >
              Community Information
            </Typography>
            <Stack spacing={2.5}>
              <StyledTextField
                label="Community Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
                required
              />

              <StyledTextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Describe your community..."
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Stack>
          </Box>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ mb: 1.5, opacity: 0.7 }}
            >
              Community Links
            </Typography>
            <Stack spacing={2}>
              {links.map((link, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {link.platform}: {link.url}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteLink(link.platform)}
                    sx={{ color: "error.main" }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Box sx={{ display: "flex", gap: 1 }}>
                <StyledTextField
                  label="Platform"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  size="small"
                />
                <StyledTextField
                  label="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddLink}
                  disabled={!newPlatform || !newUrl}
                >
                  Add
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{ p: 2.5, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
      >
        <Button
          onClick={handleModalClose}
          variant="text"
          sx={{
            color: "white",
            opacity: 0.7,
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{
            px: 3,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
