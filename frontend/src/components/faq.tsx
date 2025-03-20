import React, { useState } from "react";
import { Box } from "@mui/material";
import {
  IconButton,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const FAQ: React.FC = () => {
  const [supportAnchorEl, setSupportAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
    null
  ); // Track which question is expanded

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setSupportAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setSupportAnchorEl(null);
    setOpenQuestionIndex(null); // Reset expanded question when popover closes
  };

  const handleQuestionClick = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index); // Toggle expand/collapse
  };

  const open = Boolean(supportAnchorEl);
  const id = open ? "support-popover" : undefined;

  // FAQ content
  const faqContent = [
    {
      question: "What can the app do?",
      answer:
        "The app allows you to create and share posts, search for communities, and interact with others. You can create normal posts, self-destructing posts, and time capsule posts.",
    },
    {
      question: "What can I post?",
      answer:
        "You can post text, images, and links. Posts can be normal, self-destructing (disappear after a set time), or time capsule posts (scheduled to appear in the future).",
    },
    {
      question: "How do I post?",
      answer:
        "To create a post, go to the '+Create' section, choose the type of post (normal, self-destruct, or time capsule), add your content, and submit.",
    },
    {
      question: "What is available?",
      answer:
        "You can search for communities, join them, and participate in discussions. You can also create your own communities and manage posts within them.",
    },
    {
      question: "What are self-destruct and time capsule posts?",
      answer:
        "Self-destruct posts disappear after a set time. Time capsule posts are scheduled to appear at a future date and time.",
    },
  ];

  return (
    <>
      {/* Help Icon Button */}
      <IconButton onClick={handleClick}>
        <HelpIcon />
      </IconButton>

      {/* FAQ Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={supportAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom", // Valid values: "top", "center", "bottom"
          horizontal: "right", // Valid values: "left", "center", "right"
        }}
        transformOrigin={{
          vertical: "top", // Valid values: "top", "center", "bottom"
          horizontal: "right", // Valid values: "left", "center", "right"
        }}
        sx={{
          "& .MuiPopover-paper": {
            width: "400px", // Adjust the width of the popover
            maxHeight: "400px", // Set a max height for scrollability
            overflow: "auto", // Make the content scrollable
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            FAQ
          </Typography>

          {/* Scrollable List of Questions */}
          <List>
            {faqContent.map((faq, index) => (
              <React.Fragment key={index}>
                <ListItem
                  component="div" // Use "button" instead of the `button` prop
                  
                  onClick={() => handleQuestionClick(index)}
                  sx={{
                    backgroundColor:
                      openQuestionIndex === index ? "#f5f5f5" : "transparent",
                    width: "100%", // Ensure the ListItem takes full width
                    textAlign: "left", // Align text to the left
                    border:"2px solid black",
                    cursor: "pointer", // Show pointer cursor on hover
                  }}
                >
                  <ListItemText
                    primary={faq.question}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                  {openQuestionIndex === index ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openQuestionIndex === index} timeout="auto">
                  <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                    <Typography variant="body2">{faq.answer}</Typography>
                  </Box>
                </Collapse>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
};

export default FAQ;