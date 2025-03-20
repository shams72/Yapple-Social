/**
 * Root component of the Yapple social media application.
 * Handles the main routing logic, authentication protection,
 * and global context providers (Toast, WebSocket, Community, Post).
 */

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Login, UserPageLayout } from "./pages";
import { ProtectedRoutes, Toast } from "./components";
import { useState } from "react";
import { toastContext, WebSocketContext } from "./store";
import { ToastCtxTypes, toastState } from "./types";
import Layout from "./Layout";
import AllPost from "./pages/home-page/allPost";
import AllCommunity from "./pages/community-overview/allCommunity";
import { CommunityProvider } from "./context/communityContext";
import { PostProvider } from "./context/postContext";
import ViewCommunity from "./pages/community-page/viewCommunity";
import { FriendList, UserPageContent } from "./pages/user-page/components";
import CreatePage from "./pages/create-page/create-page";
import PostPage from "./pages/post-page/PostPage";
import useWebSocket from "react-use-websocket";
import { ToastProvider } from "./hooks/useToast";

// Environment variables
export const API_URL = import.meta.env.VITE_API_URL || "/api";
export const WEB_SOCKET_URL =
  import.meta.env.VITE_WEB_SOCKET_URL || "ws://localhost:3000";

function App() {
  const [toastState, setIsToastState] = useState<toastState>({
    open: false,
    message: "",
    alertColor: "info",
  });

  const toastValue: ToastCtxTypes = {
    open: toastState.open,
    setOpen: setIsToastState,
    message: toastState.message,
    alertColor: toastState.alertColor,
  };

  const websocket = useWebSocket(WEB_SOCKET_URL, {
    shouldReconnect: (_) => true,
    onOpen: () => {
      const clientId = localStorage.getItem("id");
      if (!clientId) return;

      websocket.sendJsonMessage({
        type: "connect",
        clientId,
      });
    },
    reconnectInterval: 5000,
    reconnectAttempts: 10,
    onMessage: (event) => {
      const data = JSON.parse(event.data);

      const profileId = localStorage.getItem("id");
      if (!profileId) return;
      if (data.from == profileId) return;

      toastValue.setOpen({
        open: true,
        alertColor: "info",
        message:
          "Notification: " + (data.type == "text" ? data.content : data.type),
      });
    },
  });

  return (
    <ToastProvider>
      <Toast {...toastValue} />
      <BrowserRouter>
        <WebSocketContext.Provider value={{ websocket }}>
          <CommunityProvider>
            <PostProvider>
              <toastContext.Provider value={toastValue}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />

                  <Route element={<Layout />}>
                    {/* Protected Routes */}
                    <Route
                      element={
                        <ProtectedRoutes>
                          <Outlet />
                        </ProtectedRoutes>
                      }
                    >
                      <Route path="/explore-posts" element={<AllPost />} />
                      <Route
                        path="/explore-community"
                        element={<AllCommunity />}
                      />
                      <Route
                        path="/explore-community/:communityId"
                        element={<ViewCommunity />}
                      />
                      <Route path="/create" element={<CreatePage />} />

                      {/* User Page Routes */}
                      <Route path="/user-page/:id" element={<UserPageLayout />}>
                        <Route index element={<UserPageContent />} />
                        <Route
                          path="follower-list"
                          element={<FriendList isFollowers={true} />}
                        />
                        <Route
                          path="following-list"
                          element={<FriendList isFollowers={false} />}
                        />
                      </Route>
                    </Route>

                    {/* Public Routes */}
                    <Route path="/post/:postId" element={<PostPage />} />
                  </Route>
                </Routes>
              </toastContext.Provider>
            </PostProvider>
          </CommunityProvider>
        </WebSocketContext.Provider>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
