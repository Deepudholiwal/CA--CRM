"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useDatabase } from "../../context/DatabaseContext";
import { useRouter, usePathname } from "next/navigation";

export default function Shell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeRole } = useDatabase();
  const router = useRouter();
  const pathname = usePathname();

  // If path is root, landing, register, login, forgot-password, or client-portal, do NOT wrap with header/sidebar
  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/client-portal" ||
    pathname?.startsWith("/api/");

  // Dynamic Page Transition/Check
  useEffect(() => {
    // If the active role is "Client" and we are NOT on client portal or auth, redirect to client portal for security simulation
    if (activeRole === "Client" && !isAuthPage && pathname !== "/client-portal") {
      router.push("/client-portal");
    }
  }, [activeRole, pathname, isAuthPage]);

  if (isAuthPage) {
    return <main className="min-h-screen bg-background text-foreground">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans relative">
      {/* Sidebar Navigation */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
        ></div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
