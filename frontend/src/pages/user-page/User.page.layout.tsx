import { GeneralInfo } from "./components";
import styles from "./User.module.css";
import { Outlet } from "react-router-dom";
import { UserProvider } from "./Provider/UserProvider";

export const UserPageLayout = () => {
  return (
    <UserProvider>
      <div className={styles.container}>
        <Outlet />
        <GeneralInfo></GeneralInfo>
      </div>
    </UserProvider>
  );
};
