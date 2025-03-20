/**
 * Main layout component that wraps all authenticated pages.
 * Provides the navigation bar and main content area structure.
 */

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
