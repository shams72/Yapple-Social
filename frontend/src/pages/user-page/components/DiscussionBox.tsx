/**
 * Real-time chat component with WebSocket integration.
 * Handles direct messaging between users with message history.
 */

import { useState, useEffect, useRef, useContext, FC } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { WebSocketContext } from "../../../store";
import { useAuth } from "../../../hooks";
import axios from "axios";
import { API_URL } from "../../../App";
import { userType } from "../types";
import { v4 } from "uuid";

interface DiscussionBoxProps {
  recieverId: string;
  onClose: () => void;
}

const DiscussionBox: FC<DiscussionBoxProps> = ({
  recieverId,
  onClose = () => {},
}) => {
  const { websocket } = useContext(WebSocketContext);
  const { sendJsonMessage, lastJsonMessage } = websocket;

  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; from: string }>
  >([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { id, token } = useAuth();
  const [recieverInfo, setRecieverInfo] = useState<Partial<userType> | null>({
    id: recieverId,
  });

  const fetchUserData = async (id: string) => {
    try {
      const res = await axios.get(`${API_URL}/user/${id}`);
      setRecieverInfo({ ...res.data, id: res.data["_id"] });
    } catch (error: any) {
      console.error("Failed to fetch recipient info:", error.message);
    }
  };

  const fetchNachirchten = async (from: string, to: string) => {
    try {
      const res = await axios.get(
        `${API_URL}/messages/get-between/${from}/${to}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const messages = res.data.map((message: any) => {
        return {
          id: message["_id"],
          from: message.from["_id"] == id ? "me" : message.from,
          text: message.content,
        };
      });
      setMessages(messages);
    } catch (error: any) {
      console.error("Failed to fetch recipient info:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData(recieverId);
    fetchNachirchten(id!, recieverId);
  }, [recieverId]);

  useEffect(() => {
    if (lastJsonMessage?.type === "message") {
      const commingFrom = lastJsonMessage.from;

      if (recieverInfo?.id != commingFrom) {
        fetchUserData(commingFrom);
        fetchNachirchten(id!, commingFrom);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: lastJsonMessage.id,
          text: lastJsonMessage.content,
          from: lastJsonMessage.from,
        },
      ]);
    }
  }, [lastJsonMessage]);

  function handleSend() {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, from: "me", text: inputText },
    ]);

    const message = {
      from: id,
      to: recieverInfo?.id,
      type: "text",
      content: inputText,
    };
    sendJsonMessage(message);

    setInputText("");
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof onClose === "function") {
      onClose();
    }
  };

  if (!recieverId) return null;

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        width: "350px",
        height: "500px",
        display: "flex",
        right: 0,
        flexDirection: "column",
        zIndex: 3,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>{recieverInfo?.displayName || "Recipient"}</strong>
        <IconButton size="small" onClick={handleClose} sx={{ marginLeft: 1 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {messages.map((msg, index) => (
            <ListItem
              key={v4()}
              sx={{
                alignSelf: msg.from === "me" ? "flex-end" : "flex-start",
                maxWidth: "70%",
                bgcolor: msg.from === "me" ? "primary.main" : "grey.100",
                color: msg.from === "me" ? "white" : "text.primary",
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemText
                primary={msg.text}
                ref={index === messages.length - 1 ? messagesEndRef : null}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          display: "flex",
          borderTop: "1px solid",
          borderColor: "divider",
          p: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => {
            handleSend();
          }}
          disabled={!inputText.trim()}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export { DiscussionBox };
