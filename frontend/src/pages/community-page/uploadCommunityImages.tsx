/**
 * Dialog for uploading and managing community banner and profile images.
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import axios from 'axios';
import { API_URL } from "../../App";
import { useToast } from "../../hooks/useToast";
import { useCommunity } from "../../context/communityContext";

const defaultBannerLink = "https://th.bing.com/th/id/OIP.VoXO6QAJnMcud_Oig38WBQHaB2?rs=1&pid=ImgDetMain";
defaultBannerLink

interface ImageUploaderProps {
  setViewImageUploader: React.Dispatch<React.SetStateAction<boolean>>;
  setCommunityProfilePicture: React.Dispatch<React.SetStateAction<string | null>>;
  setCommunityBanner: React.Dispatch<React.SetStateAction<string | null>>;
  communityBanner: string;
  communityProfilePicture: string;
  communityId: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  setCommunityBanner,
  setCommunityProfilePicture,
  setViewImageUploader,
  communityId,
  communityBanner,
  communityProfilePicture
}) => {

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bannerPic, setBannerPic] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { showToast } = useToast();
  communityProfilePicture
  communityBanner
  const { setCommunityData} = useCommunity();

  const handleProfilePicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfilePic(reader.result.toString());
          setImageFile(file);
          
        }
      };
      reader.readAsDataURL(file);
    
    }

  };

  const handleBannerPicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setBannerPic(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImages = async () => {
    try {
      if (bannerPic) {
        const data = {
          id: localStorage.getItem("id"),
          uploadedBy: localStorage.getItem("id"),
          url: "banner",
          relatedObject: communityId,
          data: bannerPic,
        };
        await axios.post(`${API_URL}/media/upload-community-banner`, data, { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setCommunityBanner(bannerPic);
      }

      if (profilePic) {
        const data = {
          id: localStorage.getItem("id"),
          uploadedBy: localStorage.getItem("id"),
          url: "profile",
          relatedObject: communityId,
          data: profilePic,
        };
        await axios.post(`${API_URL}/media/upload-community-pic`, data, { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        
        const formData = new FormData();

        if (imageFile) {
          formData.append('file', imageFile);
        }
            
        const response = await axios.post(
            `${API_URL}/media/upload-and-save-to-disk`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        await axios.put(`${API_URL}/community/add-banner-URL-by-ID`, 
          { id: localStorage.getItem("id"),
            communityID: communityId,
            bannerUrl: response.data.url,
          }, 
          { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        setCommunityData(prevData =>
          prevData.map(c =>
            c._id === communityId ? { ...c, bannerUrl: response.data.url } : c
          )
        );             
        setCommunityProfilePicture(profilePic);
      }

      if (bannerPic || profilePic) {
        showToast("Images uploaded successfully!", "success");
      }
      setViewImageUploader(false);
    } catch (error) {
      showToast("Failed to upload images. Please try again.", "error");
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={() => setViewImageUploader(false)}
      PaperProps={{
        sx: { 
          bgcolor: 'rgb(60, 60, 60)', 
          color: 'white',
          width: '100%',
          maxWidth: '400px',
          m: 2
        }
      }}
    >
      <DialogTitle>Update Community Images</DialogTitle>
      <DialogContent sx={{ overflowX: 'hidden' }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Banner Image</Typography>
            <Box sx={{ 
              '& input': { 
                color: 'white',
                width: '100%',
                maxWidth: '300px'
              }
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerPicUpload}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>Profile Picture</Typography>
            <Box sx={{ 
              '& input': { 
                  color: 'white',
                width: '100%',
                maxWidth: '300px'
                }
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
            />

          </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
                  <Button 
          onClick={() => setViewImageUploader(false)}
          variant="text"
          sx={{ color: 'white' }}
                  >
          Cancel
                  </Button>
                <Button 
          onClick={handleSaveImages}
                  variant="contained" 
          color="primary"
                >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploader;
