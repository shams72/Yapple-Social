import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Box, Button, Avatar } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Menu Button */}
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        {/* Brand/Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
          Apple
        </Typography>

        {/* Search Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 1, px: 2, mr: 2 }}>
          <InputBase placeholder="Search…" />
        </Box>

        {/* Create Button */}
        <Button variant="contained" color="secondary" sx={{ mr: 2 }}>
          Create
        </Button>

        {/* Notification Icon */}
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>

        {/* Profile Picture */}
        <Avatar alt="Profile Picture" src="/path-to-your-image.jpg" />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
