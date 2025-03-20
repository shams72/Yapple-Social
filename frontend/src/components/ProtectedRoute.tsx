import React, { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { toastContext } from "../store";

export const ProtectedRoutes: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { isTokenValid } = useAuth();
  const ctx = useContext(toastContext);

  const [isAuthenticed, setIsAuthenticated] = useState(false);

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id || !token || !isTokenValid(token)) {
      navigate("/login");
      ctx.setOpen((prev) => {
        return {
          ...prev,
          message: "Session terminated",
          open: true,
          alertColor: "error",
        };
      });
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticed) {
    return null;
  }

  return children;
};
