/**
 * Global toast notification component for displaying alerts and messages.
 * Supports different alert types (success, error, info, warning) and auto-dismissal.
 */

import { FC } from "react";
import * as React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import { toastState } from "../types";

interface ToastProps {
  message: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<toastState>>;
  alertColor: AlertColor;
}

export const Toast: FC<ToastProps> = ({
  message,
  open,
  setOpen,
  alertColor,
}) => {
  const handleClose = (
    _?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen((prev) => {
      return { ...prev, open: false };
    });
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertColor}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
