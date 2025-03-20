import React, { useState, useContext, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import { API_URL } from '../../../App';
import { useAuth } from '../../../hooks';
import { toastContext, UserContext } from '../../../store';
import { usePost } from '../../../context/postContext';
interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgb(60, 60, 60)',
    color: theme.palette.common.white,
    minWidth: '500px',
    borderRadius: theme.spacing(2),
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.spacing(1),
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const FileUploadButton = styled('label')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  }
}));

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose }) => {
  const { id, token } = useAuth();
  const userCtx = useContext(UserContext);
  const toastCtx = useContext(toastContext);
  const { setProfilePicture} = usePost();
  
  // init form data with current values
  const [formData, setFormData] = useState({
    displayName: '',
    bio: ''
  });

  // reset form data when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        displayName: userCtx.displayName || '',
        bio: userCtx.bio || ''
      });
    }
  }, [open, userCtx]);

  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [previewBannerUrl, setPreviewBannerUrl] = useState<string | null>(null);
  const [previewProfileUrl, setPreviewProfileUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    displayName: '',
    bio: ''
  });

  const validateForm = () => {
    const newErrors = {
      displayName: '',
      bio: ''
    };
    
    // validate display name
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    setErrors(newErrors);
    return !newErrors.displayName && !newErrors.bio;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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

    const file = e.target.files[0];
    setSelectedProfileFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPreviewProfileUrl(previewUrl);
  };

  const handleModalClose = () => {
    if (previewBannerUrl) {
      URL.revokeObjectURL(previewBannerUrl);
      setPreviewBannerUrl(null);
      setPreviewProfileUrl(null);
    }
    setSelectedBannerFile(null);
    setSelectedProfileFile(null);
  
    setErrors({ displayName: '', bio: '' });
    onClose();
  };

  const uploadBanner = async (): Promise<string | null> => {
    if (!selectedBannerFile) return null;

    const formData = new FormData();
    formData.append('file', selectedBannerFile);

    try {
      const uploadRes = await axios.post(
        `${API_URL}/media/upload-and-save-to-disk`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      await axios.put(
        `${API_URL}/user/update-banner`,
        { id, url: uploadRes.data.url },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return uploadRes.data.url;
    } catch (error) {
      throw error;
    }
  };

  const uploadProfile = async (): Promise<string | null> => {
    if (!selectedProfileFile) return null;

    const formData = new FormData();
    formData.append('file', selectedProfileFile);

    try {
      const uploadRes = await axios.post(
        `${API_URL}/media/upload-and-save-to-disk`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      await axios.put(
        `${API_URL}/user/update-profile`,
        { id, url: uploadRes.data.url },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return uploadRes.data.url;
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toastCtx.setOpen({
        open: true,
        message: 'Please fix the errors before saving',
        alertColor: 'error',
      });
      return;
    }

    try {
      // first update profile info
      const res = await axios.put(
        `${API_URL}/user/update`,
        {
          id,
          ...formData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // then upload banner if selected
      let bannerUrl = null;
      if (selectedBannerFile) {
        bannerUrl = await uploadBanner();
      }

      let profileUrl = null;
      if (selectedProfileFile) {
        profileUrl = await uploadProfile();
        
      }

      // update context with all changes
      userCtx.setUserInfo(prev => ({
        ...prev,
        ...res.data,
        ...(bannerUrl ? { bannerPictureUrl: bannerUrl } : {}),
        ...(profileUrl ? {profilePictureUrl: profileUrl } : {}),
      }));

      setProfilePicture(`${API_URL}/${profileUrl}`);

      toastCtx.setOpen({
        open: true,
        message: 'Profile updated successfully',
        alertColor: 'success',
      });

      handleModalClose();
    } catch (error) {
      toastCtx.setOpen({
        open: true,
        message: 'Failed to update profile',
        alertColor: 'error',
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
        <Typography variant="h6">Edit Profile</Typography>
        <IconButton 
          onClick={handleModalClose}
          size="small"
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5, opacity: 0.7 }}>
              Banner Image
            </Typography>
            <Box sx={{ position: 'relative', mb: 6 }}>
            
              {!previewBannerUrl && <div  style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '8px',
                  border: '2px solid white'
                }}>
                    
                </div>}
                {previewBannerUrl && <img 
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
                src={previewBannerUrl} 
                alt="Banner preview" 
               
                />}
                
              {/* Profile Picture (Circular & Overlapping Banner) */}
              {(
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    left: '10%', 
                    bottom: '10px', 
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)' 
                  }}
                >
                  {!previewProfileUrl && <div style={{
                      width: '70px',
                      height: '70px',
                  
                      borderRadius: '50%',
                      border: '4px solid white' // Optional: Adds a white border
                    }} >
                      
                  </div>}

                  {previewProfileUrl && (<img 
                    src={previewProfileUrl} 
                    alt="Profile preview" 
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      border: '4px solid white' // Optional: Adds a white border
                    }} 
                  />)}
                  
                </Box>
              )}
            </Box>


            <div>
              <FileUploadButton>
                <PhotoCameraIcon sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {selectedBannerFile ? 'Change Banner Image' : 'Upload Banner Image'}
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerSelect}
                  style={{ display: 'none' }}
                />
              </FileUploadButton>
            </div>

            <div style={{ marginTop: '20px' }}>
            <FileUploadButton>
                <PhotoCameraIcon sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'white' }}>
                  { selectedProfileFile ? 'Change Profile Image' : 'Upload Profile Image'}
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileSelect}
                  style={{ display: 'none' }}
                />
              </FileUploadButton>
            </div>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5, opacity: 0.7 }}>
              Profile Information
            </Typography>
            <Stack spacing={2.5}>
              <StyledTextField
                label="Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.displayName}
                helperText={errors.displayName}
                required
              />

              <StyledTextField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Tell us about yourself..."
                error={!!errors.bio}
                helperText={errors.bio}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <Button 
          onClick={handleModalClose}
          variant="text"
          sx={{ 
            color: 'white',
            opacity: 0.7,
            '&:hover': {
              opacity: 1
            }
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
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}; 