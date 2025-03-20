import React, { useState, useContext } from "react";
import { Container, Paper, Tabs, Tab, Box } from "@mui/material";
import CreatePost from "../createPost/create-post";
import CreateCommunity from "./createCommunity";
import "./create-page.css";
import { toastContext } from "../../store";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const CreatePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [_, setShowCreatePost] = useState(true);
  const [showCreateCommunity, setShowCreateCommunity] = useState(true);
  showCreateCommunity;
  const { setOpen } = useContext(toastContext);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePostSuccess = () => {
    setOpen({
      open: true,
      message: "Post created successfully!",
      alertColor: "success",
    });
    setShowCreatePost(false);
  };

  const handlePostError = (error: string) => {
    setOpen({
      open: true,
      message: `Error creating post: ${error}`,
      alertColor: "error",
    });
  };

  const handleCommunitySuccess = () => {
    setOpen({
      open: true,
      message: "Community created successfully!",
      alertColor: "success",
    });
    setShowCreateCommunity(false);
  };

  const handleCommunityError = (error: string) => {
    setOpen({
      open: true,
      message: `Error creating community: ${error}`,
      alertColor: "error",
    });
  };

  return (
    <div className="create-page-container">
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  fontSize: "1rem",
                  fontWeight: 500,
                  textTransform: "none",
                  minHeight: 56,
                  "&.Mui-selected": {
                    color: "primary.main",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                },
              }}
            >
              <Tab label="Create Post" />
              <Tab label="Create Community" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CreatePost
              setCreatePost={setShowCreatePost}
              onSuccess={handlePostSuccess}
              onError={handlePostError}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <CreateCommunity
              setCreateCommunity={setShowCreateCommunity}
              onSuccess={handleCommunitySuccess}
              onError={handleCommunityError}
            />
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
};

export default CreatePage;
