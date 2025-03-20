/**
 * Authentication hook for managing user sessions and token validation.
 * Handles login state, token verification, and secure logout.
 */

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "../context/communityContext";

export const useAuth = () => {
  const navigate = useNavigate();
   const { setJoinedCommunities, setAdmin } = useCommunity();

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    setAdmin(new Set());
    setJoinedCommunities(new Set());
    navigate("/login");
  }

  const isTokenValid = (token: string) => {
    try {
      const tokenHeader = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      return tokenHeader.exp! > currentTime;
    } catch (error) {
      return false;
    }
  };

  return {
    logout: logout,
    isTokenValid: isTokenValid,
    token,
    id,
  };
};
