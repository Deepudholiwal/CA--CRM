"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDatabase } from "../../context/DatabaseContext";
import {
  LayoutDashboard,
  Users,
  Percent,
  Landmark,
  FileSpreadsheet,
  Building2,
  FileCheck,
  CheckSquare,
  UserCheck,
  FolderClosed,
  CreditCard,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Settings as SettingsIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (o: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { tenant } = useDatabase();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients & CRM", href: "/clients", icon: Users },
    { name: "GST filing", href: "/gst", icon: Percent },
    { name: "Income Tax (ITR)", href: "/itr", icon: Landmark },
    { name: "TDS compliance", href: "/tds", icon: FileSpreadsheet },
    { name: "ROC & Corporate", href: "/roc", icon: Building2 },
    { name: "Audit workspace", href: "/audit", icon: FileCheck },
    { name: "Tasks & Kanban", href: "/tasks", icon: CheckSquare },
    { name: "Employees & HR", href: "/employees", icon: UserCheck },
    { name: "Document Vault", href: "/documents", icon: FolderClosed },
    { name: "Billing & Invoices", href: "/billing", icon: CreditCard },
    { name: "Reports & Analytics", href: "/reports", icon: BarChart3 },
    { name: "Compliance Calendar", href: "/calendar", icon: CalendarIcon },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const activeClass = "bg-primary text-primary-foreground shadow-md";
  const inactiveClass = "text-muted-foreground hover:bg-muted/80 hover:text-foreground";

  return (
    <div
      className={`h-screen bg-card text-card-foreground border-r border-border/60 flex flex-col transition-all duration-300 fixed md:relative z-40 md:z-20 top-0 bottom-0 left-0 ${
        collapsed ? "w-20" : "w-64"
      } ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/60">
        {!collapsed && (
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {tenant.name.charAt(0)}
            </div>
            <div className="font-semibold text-sm leading-tight max-w-[160px] truncate">
              {tenant.name.includes("Deepak") ? "Deepak Yadav & Co." : `${tenant.name.split(" ")[0]} & Co.`}
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto">
            {tenant.name.charAt(0)}
          </div>
        )}
        
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 w-6 h-6 bg-card border border-border/80 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm hover:bg-muted transition-colors cursor-pointer z-30"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen?.(false)}
              className={`flex items-center p-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? activeClass : inactiveClass
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Client Portal Link */}
      <div className="p-3 border-t border-border/60 bg-muted/20">
        <Link
          href="/client-portal"
          onClick={() => setMobileOpen?.(false)}
          className={`flex items-center p-2.5 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors border border-emerald-500/20 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Client Portal" : undefined}
        >
          <ExternalLink className={`w-4 h-4 flex-shrink-0 ${collapsed ? "" : "mr-2"}`} />
          {!collapsed && <span>Client Portal</span>}
        </Link>
      </div>
    </div>
  );
}
