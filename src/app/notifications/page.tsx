"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import {
  Bell,
  CheckCheck,
  AlertCircle,
  FileCheck,
  CreditCard,
  Trash2,
  Filter
} from "lucide-react";

interface AlertItem {
  id: string;
  category: "FILING" | "NOTICE" | "BILLING" | "GENERAL";
  message: string;
  time: string;
  isUnread: boolean;
}

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: "al-1", category: "NOTICE", message: "Notice of adjustment Sec 143(1) issued regarding interest income discrepancy for Acme Tech Solutions.", time: "1 hour ago", isUnread: true },
    { id: "al-2", category: "FILING", message: "GSTR-3B monthly return filed successfully for Zenith Developers (ARN-3B-881290).", time: "4 hours ago", isUnread: false },
    { id: "al-3", category: "GENERAL", message: "Audit Manager Ananya Sharma submitted draft statutory report schedules for final partner review.", time: "1 day ago", isUnread: true },
    { id: "al-4", category: "BILLING", message: "UPI Payment receipt REC-2026-003 received for ₹4,720 from Devendra Patil (Individual).", time: "2 days ago", isUnread: false },
    { id: "al-5", category: "NOTICE", message: "GST ASMT-10 discrepancy scrutiny alert issued on GST portal for Karan Johar & Partners.", time: "3 days ago", isUnread: true }
  ]);

  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredAlerts = alerts.filter(
    (a) => categoryFilter === "all" || a.category === categoryFilter
  );

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isUnread: false })));
    alert("All notifications marked as read!");
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
            <Bell className="w-6 h-6 mr-2 text-primary" /> Alert & Notifications Hub
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitor real-time compliance alerts, portal check-in logs, and partner approvals status.
          </p>
        </div>

        {/* Clear buttons */}
        <button
          onClick={markAllRead}
          className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg flex items-center cursor-pointer shadow-sm self-start md:self-center"
        >
          <CheckCheck className="w-4 h-4 mr-1.5" /> Mark All as Read
        </button>
      </div>

      {/* Main Board */}
      <Card>
        <CardHeader className="pb-2 border-b border-border/40 mb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-bold">Activity Notifications</CardTitle>
            
            {/* Filters */}
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="NOTICE">Notices</option>
                <option value="FILING">GST/ITR Filings</option>
                <option value="BILLING">Billing Collections</option>
                <option value="GENERAL">Workflows</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {filteredAlerts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No notifications found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Message description</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((a) => (
                  <TableRow
                    key={a.id}
                    className={a.isUnread ? "bg-primary/[0.02]" : "bg-card"}
                  >
                    <TableCell>
                      <Badge variant={a.category === "NOTICE" ? "destructive" : a.category === "FILING" ? "success" : a.category === "BILLING" ? "info" : "secondary"}>
                        {a.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[400px] truncate">
                      <span className={`text-xs ${a.isUnread ? "font-bold text-foreground" : "text-foreground/90 font-medium"}`}>
                        {a.message}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.time}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => deleteAlert(a.id)}
                        className="p-1 rounded bg-muted hover:bg-red-500/10 hover:text-red-500 text-slate-400 transition-colors cursor-pointer"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
