import { createContext } from "react";
import { ToastCtxTypes } from "../types";

const defaultToastState: ToastCtxTypes = {
  open: false,
  setOpen: () => {},
  message: "",
  alertColor: "info",
};

export const toastContext = createContext<ToastCtxTypes>(defaultToastState);
