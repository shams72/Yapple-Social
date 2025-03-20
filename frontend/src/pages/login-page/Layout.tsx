/**
 * Layout wrapper for the login page.
 * Centers content vertically and horizontally in a column layout.
 */

import { FC } from "react";

export const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex" , flexDirection:"column", alignItems:"center"} }>{children}</div>
  );
};
