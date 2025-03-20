import React from 'react';
import { Modal, Box, IconButton, Fade } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, imageUrl }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'relative',
            maxWidth: '95vw',
            maxHeight: '95vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              width: '44px',
              height: '44px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Close sx={{ fontSize: 28 }} />
          </IconButton>
          <Box
            sx={{
              position: 'relative',
              width: 'fit-content',
              height: 'fit-content',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
          >
            <img
              src={imageUrl}
              alt="Enlarged view"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                display: 'block',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ImageModal; 