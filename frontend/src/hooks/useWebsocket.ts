/**
 * WebSocket connection manager with auto-reconnect functionality.
 * Handles real-time messaging and connection state management.
 */

import { useEffect, useRef, useState } from "react";
import { SocketMessage } from "../types";

export const useWebsocket = (
  onMessage?: (msg: SocketMessage) => void,
  url: string = "ws://localhost:3000",
  reconnectInterval = 5000,
  maxReconnectAttempts = 10
) => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const manualClose = useRef(false);

  // Store the latest onMessage callback in a ref
  const messageHandlerRef = useRef(onMessage);

  // Keep the messageHandlerRef updated when onMessage changes
  useEffect(() => {
    messageHandlerRef.current = onMessage;
  }, [onMessage]);

  const connectWebSocket = () => {
    console.log("Connecting to WebSocket...");
    const webSocket = new WebSocket(url);
    setWebSocket(webSocket);

    webSocket.onopen = () => {
      console.log("WebSocket connected");
      reconnectAttempts.current = 0;
    };

    webSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as SocketMessage;
        // Use the latest version of the onMessage callback
        if (messageHandlerRef.current) {
          messageHandlerRef.current(message);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    webSocket.onclose = (event) => {
      if (!manualClose.current) {
        console.warn("WebSocket closed unexpectedly:", event);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect();
        } else {
          console.error("Max reconnect attempts reached. No further retries.");
        }
      } else {
        console.log("WebSocket closed manually.");
      }
    };
  };

  const scheduleReconnect = () => {
    reconnectAttempts.current += 1;
    console.log(
      `Reconnect attempt ${reconnectAttempts.current} of ${maxReconnectAttempts}...`
    );
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
    reconnectTimer.current = setTimeout(() => {
      connectWebSocket();
    }, reconnectInterval);
  };

  useEffect(() => {
    manualClose.current = false;
    connectWebSocket();

    return () => {
      console.log("Cleaning up WebSocket");
      if (webSocket) {
        manualClose.current = true;
        webSocket.close();
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [url, reconnectInterval, maxReconnectAttempts]);

  return webSocket;
};
