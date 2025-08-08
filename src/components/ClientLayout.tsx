"use client";

import React from "react";
import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Logo from "./Logo";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  const hideNavigation = pathname === "/login";

  return (
    <div className="flex w-full gap-3">
      <div className="flex flex-col  gap-6 mb-3 ">
        {!hideNavigation && <Logo />}
        {!hideNavigation && <Sidebar />}
      </div>
      <div className="flex flex-col w-full gap-3 m-3">
        {!hideNavigation && <Navbar />}
        <div
          className="
          border
          rounded-lg
         min-h-screen
         bg-gray-100
         w-full
        "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
