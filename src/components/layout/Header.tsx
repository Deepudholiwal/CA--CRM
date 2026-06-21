"use client";

import React, { useState } from "react";
import { useDatabase, ROLE_PERMISSIONS } from "../../context/DatabaseContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Building,
  User,
  Shield,
  LogOut,
  AlertTriangle,
  FolderSync
} from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const {
    activeRole,
    setActiveRole,
    activeBranch,
    setActiveBranch,
    branches,
    clients,
    tasks,
    documents,
    tenant
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ type: string; title: string; subtitle: string; href: string }[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notifications summary
  const mockNotifications = [
    { id: 1, text: "Notice received from Income Tax dept (Sec 143-1) for Acme Tech.", time: "1 hour ago", unread: true },
    { id: 2, text: "GSTR-3B filed successfully for Zenith Developers.", time: "4 hours ago", unread: false },
    { id: 3, text: "Audit report draft submitted by Priya Nair for approval.", time: "1 day ago", unread: true },
  ];

  // Smart Search logic
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];

    // Search clients
    clients
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.clientId.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .forEach((c) => {
        results.push({ type: "Client", title: c.name, subtitle: c.clientId, href: "/clients" });
      });

    // Search tasks
    tasks
      .filter((t) => t.title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .forEach((t) => {
        results.push({ type: "Task", title: t.title, subtitle: `Assigned: ${t.assignedToName}`, href: "/tasks" });
      });

    // Search documents
    documents
      .filter((d) => d.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .forEach((d) => {
        results.push({ type: "Document", title: d.name, subtitle: d.category, href: "/documents" });
      });

    setSearchResults(results);
  };

  return (
    <header className="h-16 border-b border-border/60 bg-card text-card-foreground flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative w-80 max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search clients, tasks, folders..."
          value={searchQuery}
          onChange={(e) => {
            handleSearch(e.target.value);
            setShowSearchModal(true);
          }}
          onFocus={() => setShowSearchModal(true)}
          className="block w-full pl-10 pr-3 py-1.5 border border-border/60 rounded-lg text-sm bg-muted/30 placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
        />

        {/* Search Results Dropdown */}
        {showSearchModal && searchQuery && (
          <div className="absolute left-0 mt-2 w-96 bg-card border border-border rounded-xl shadow-xl z-50 p-2 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between px-3 py-1 border-b border-border/60 mb-2">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Search Results</span>
              <button onClick={() => { setSearchQuery(""); setShowSearchModal(false); }} className="text-xs text-primary hover:underline">Clear</button>
            </div>
            {searchResults.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3 text-center">No results found for "{searchQuery}"</p>
            ) : (
              searchResults.map((res, i) => (
                <Link
                  key={i}
                  href={res.href}
                  onClick={() => setShowSearchModal(false)}
                  className="flex flex-col p-2.5 hover:bg-muted/80 rounded-lg transition-colors border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{res.type}</span>
                    <span className="text-sm font-semibold text-foreground truncate">{res.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5 pl-1">{res.subtitle}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-4">
        {/* Branch Switcher */}
        <div className="flex items-center space-x-1.5 border border-border/60 rounded-lg px-2.5 py-1 bg-muted/20">
          <Building className="w-4 h-4 text-muted-foreground" />
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="text-xs font-medium bg-transparent border-none text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name.split(" ")[0]} ({b.code})
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Role Switcher (RBAC Simulator) */}
        <div className="flex items-center space-x-1.5 border border-primary/20 rounded-lg px-2.5 py-1 bg-primary/5">
          <Shield className="w-4 h-4 text-primary" />
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            className="text-xs font-semibold bg-transparent border-none text-primary focus:outline-none cursor-pointer"
          >
            {ROLE_PERMISSIONS.map((rp) => (
              <option key={rp.role} value={rp.role} className="text-foreground">
                {rp.role}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer"
          title="Toggle Dark/Light Mode"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 p-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                <span className="font-semibold text-sm">Recent Alerts</span>
                <Link href="/notifications" onClick={() => setShowNotifications(false)} className="text-xs text-primary hover:underline">View All</Link>
              </div>
              <div className="space-y-2">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`p-2 rounded-lg text-xs leading-snug border border-border/30 transition-colors ${n.unread ? "bg-primary/5 border-primary/20" : "bg-card"}`}>
                    <p className="font-medium text-foreground">{n.text}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="flex items-center space-x-2 border-l border-border/60 pl-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 text-primary">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold leading-none text-foreground">
              {activeRole === "Client" ? "Siddharth Mehta" : "Deepak Yadav, CA"}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-none">
              {activeRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
