/**
 * Horizontal scrollable list of suggested friends with infinite scroll.
 * Provides follow and chat actions for each suggested user.
 */

import { v4 } from "uuid";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks";
import { UserCard } from "./UserCard";
import styles from "./FriendsSuggetion.module.css";
import { API_URL } from "../../../App";
import { userType } from "../types";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button } from "@mui/material";
import { DiscussionBox } from "./DiscussionBox";
import { WebSocketContext } from "../../../store";

export const FriendSuggestion = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { id, token } = useAuth();
  const [suggestions, setSuggestions] = useState<userType[]>([]);
  const lastElement = useRef<HTMLSpanElement | null>(null);
  const [SuggestionPageNumber, setSuggestionPageNumber] = useState(0);
  const isNoMoreSuggestion = useRef(false);
  const setIntervalId = useRef<NodeJS.Timeout>();
  const [recieverId, setRecieverId] = useState<string>("");
  const websocket = useContext(WebSocketContext);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOnMouseDown = (scrollAmount: number) => {
    setIntervalId.current = setInterval(() => {
      handleScroll(scrollAmount);
    }, 300);
  };

  const handleOnMouseUp = () => {
    clearInterval(setIntervalId.current);
  };

  const handleScroll = (scrollAmount: number) => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollLeft;
    containerRef.current.scrollTo({
      left: scrollAmount + currentScroll,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isNoMoreSuggestion.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSuggestionPageNumber((prev) => prev + 1);
          }
        });
      },
      { root: containerRef.current, rootMargin: "0px", threshold: 0.5 }
    );

    if (lastElement.current) {
      observer.observe(lastElement.current);
    }

    return () => {
      if (lastElement.current) {
        observer.unobserve(lastElement.current);
      }
    };
  }, [lastElement.current, suggestions]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/user/get-suggestions`,
          { id, page: SuggestionPageNumber },
          { headers: { Authorization: ` Bearer ${token}` } }
        );

        if (res.data.suggestions.length === 0) {
          isNoMoreSuggestion.current = true;
        }

        const filteredSuggestions = res.data.suggestions.filter(
          (suggestion: any) => suggestion._id !== id
        );

        setSuggestions((prev) => [
          ...prev,
          ...filteredSuggestions.map((suggestion: any) => ({
            ...suggestion,
            id: suggestion["_id"],
          })),
        ]);
      } catch (error: any) {
        console.log("Error fetching suggestions:", error.message);
      }
    };

    fetchSuggestions();
  }, [SuggestionPageNumber]);

  useEffect(() => {
    const message = websocket.websocket.lastJsonMessage;
    if (message?.type == "message") {
      const revieverId = message.from;

      const getReciverUserName = async () => {
        const userInfo = await fetch(API_URL + `/user/${revieverId}`);
        const data = await userInfo.json();
        setRecieverId(data.username);
        setIsChatOpen(true);
      };
      getReciverUserName();
    }

    console.log(message);
  }, [websocket.websocket.lastJsonMessage]);

  const handleChatClick = (userId: string) => {
    setRecieverId(userId);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setRecieverId("");
    setIsChatOpen(false);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.horizontalSliding} ref={containerRef}>
          {suggestions.map((suggestion, index) => {
            return (
              <span
                ref={(node) => {
                  if (index === suggestions.length - 1) {
                    lastElement.current = node;
                  }
                }}
                key={v4()}
              >
                <UserCard {...suggestion} />
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button onClick={() => handleChatClick(suggestion.id)}>
                    Chat
                  </Button>
                </Box>
              </span>
            );
          })}
        </div>

        <Button
          sx={{ position: "absolute", top: "35%" }}
          onClick={() => handleScroll(-179)}
          onMouseDown={() => {
            handleOnMouseDown(-179);
          }}
          onMouseUp={handleOnMouseUp}
        >
          <ArrowBackIosIcon />
        </Button>
        <Button
          sx={{ position: "absolute", top: "35%", fontSize: "20em", right: 0 }}
          onClick={() => handleScroll(+179)}
          onMouseDown={() => {
            handleOnMouseDown(179);
          }}
          onMouseUp={handleOnMouseUp}
        >
          <ArrowForwardIosIcon />
        </Button>
      </div>

      {isChatOpen && recieverId && (
        <DiscussionBox recieverId={recieverId} onClose={handleCloseChat} />
      )}
    </>
  );
};
