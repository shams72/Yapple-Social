import { createContext, } from "react";
import { ReadyState } from 'react-use-websocket';
import { WebSocketHook } from "react-use-websocket/dist/lib/types";

type WebSocketContextType = {
    websocket: WebSocketHook;
  };
  
  const initialContextValue: WebSocketContextType = {
    websocket: {
      sendMessage: () => {},
      sendJsonMessage: () => {},
      lastMessage: null,
      lastJsonMessage: null,
      readyState: ReadyState.CLOSED,
      getWebSocket: () => null,
    }
  };
  
  export const WebSocketContext = createContext<WebSocketContextType>(initialContextValue);