import { FormikHelpers } from "formik";
import { MyFormValues } from "../types";
import axios from "axios";
import React, { SetStateAction } from "react";
import { SocketMessage, toastState } from "../../../types";
import { NavigateFunction } from "react-router-dom";
import { API_URL } from "../../../App";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";

export const onSubmit = async (
  values: MyFormValues,
  actions: FormikHelpers<MyFormValues>,
  setOpen: React.Dispatch<SetStateAction<toastState>>,
  navigate: NavigateFunction,
  isToogle: boolean,
  websocket: WebSocketHook
) => {
  const authMode = isToogle;

  if (authMode) {
    try {
      const res = await axios.post(API_URL + "/auth/sign-up", {
        displayName: values.displayName,
        username: values.username,
        passwordHash: values.password,
      });

      if (res && res.status === 201) {
        setOpen({
          open: true,
          alertColor: "success",
          message: "Account successfully created! Welcome!",
        });

        localStorage.setItem("id", res.data.id);
        localStorage.setItem("token", res.data.token);

        const message: SocketMessage = {
          type: "connect",
          clientId: res.data.id,
        };

        websocket.sendJsonMessage(message);

        navigate("/explore-posts");
      } else {
        setOpen({
          open: true,
          alertColor: "error",
          message: "Error during account creation, please try again later.",
        });
      }
    } catch (error: any) {
      let message = "";

      if (error.response.data.error.message.includes("duplicate key")) {
        message = "This username is already in use";
      }

      setOpen({
        open: true,
        alertColor: "error",
        message: message.length ? message : "Please fill all fields",
      });
    }

    actions.setSubmitting(false);
    return;
  }

  try {
    const response = await axios.post(API_URL + "/auth/sign-in", {
      username: values.username,
      password: values.password,
    });

    if (response && response.status === 200) {
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);

      const message: SocketMessage = {
        type: "connect",
        clientId: response.data.id,
      };

      websocket.sendJsonMessage(message);

      navigate("/explore-posts");
    } else {
      setOpen({
        open: true,
        alertColor: "error",
        message:
          response.data?.message || "Invalid credentials. Please try again.",
      });
    }
  } catch (error: any) {
    setOpen({
      open: true,
      alertColor: "error",
      message: error.response.data.error.message,
    });
  }

  actions.setSubmitting(false);
};
