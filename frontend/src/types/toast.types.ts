import { AlertColor } from "@mui/material";

export interface toastState {
  open: boolean;
  message: string;
  alertColor: AlertColor;
}

export interface ToastCtxTypes {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<toastState>>;
  message: string;
  alertColor: AlertColor;
}
