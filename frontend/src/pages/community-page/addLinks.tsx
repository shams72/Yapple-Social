/**
 * Modal dialog for adding social/platform links to a community.
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  styled
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../App";

interface AddLinksProps {
  setLinkBox: React.Dispatch<React.SetStateAction<boolean>>;
  communityID?: string;
  links: { platform: string; url: string }[];
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgb(60, 60, 60)',
    color: theme.palette.common.white,
    minWidth: '400px',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
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

const AddLinks: React.FC<AddLinksProps> = ({
  setLinkBox,
  communityID,
  links,
}) => {
  const [linkName, setLinkName] = useState<string>("");
  const [linkUrl, setLinkUrl] = useState<string>("");

  const handleAddLinks = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      id: localStorage.getItem("id"),
      communityID: communityID,
      platform: linkName,
      url: linkUrl,
    };

    try {
      const response = await axios.put(
        `${API_URL}/community/add-platform-links-by-ID`,
        data,
        { headers: { Authorization: ` Bearer ${localStorage.getItem("token")}` } }
      );

      if (response) {
        links.push({ platform: linkName, url: linkUrl });
        setLinkBox(false);
      }
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  return (
    <StyledDialog 
      open={true} 
      onClose={() => setLinkBox(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add Link</DialogTitle>
      <form onSubmit={handleAddLinks}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledTextField
              label="Platform Name"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiInputLabel-root': {
                  color: '#000000', // Set label color to green
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#000000', // Set border color to green
                  },
                  '&:hover fieldset': {
                    borderColor: '#000000', // Set border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0000000', // Set border color when focused
                  },
                },
              }}
            />
            <StyledTextField
              label="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiInputLabel-root': {
                  color: '#000000', // Set label color to green
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#000000', // Set border color to green
                  },
                  '&:hover fieldset': {
                    borderColor: '#000000', // Set border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#000000', // Set border color when focused
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setLinkBox(false)}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'red',background:"red" }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
          >
            Add Link
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default AddLinks;
