import React from "react";
import { userType } from "../pages/user-page/types";

export interface UserCtx extends userType {
    setUserInfo: React.Dispatch<React.SetStateAction<userType>>
}