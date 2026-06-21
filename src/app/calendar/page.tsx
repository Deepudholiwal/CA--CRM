"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import {
  Calendar as CalendarIcon,
  Search,
  MessageSquare,
  Mail,
  Bell,
  Clock,
  Filter,
  CheckCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Settings
} from "lucide-react";

export default function CalendarPage() {
  const { filings, clients, activeBranch, sendWhatsAppNotification } = useDatabase();
  const [calendarView, setCalendarView] = useState<"month" | "week" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Filters due dates (pending filings)
  const dueDates = useMemo(() => {
    return filings
      .filter((f) => {
        const client = clients.find((c) => c.id === f.clientId);
        const matchBranch = activeBranch === "all" || (client && client.branchId === activeBranch);
        const matchSearch =
          f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.type.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchBranch && matchSearch;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [filings, clients, activeBranch, searchQuery]);

  const handleSendWhatsAppNotification = (clientId: string, type: string, period: string, date: string) => {
    const msg = `Dear Client, this is a compliance alert regarding return filing ${type} for ${period}. The due date is ${date}. Please verify your schedules. Regards, Deepak Yadav & Associates.`;
    sendWhatsAppNotification(clientId, msg);
    alert("WhatsApp due alert successfully queued & logged!");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-primary" /> Practice Compliance Calendar
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitor GST, Income Tax, TDS, and ROC corporate filings deadlines. Dispatch automated alerts to clients.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center space-x-1.5 border border-border/60 bg-muted/20 p-1 rounded-lg">
          <button
            onClick={() => setCalendarView("list")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              calendarView === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Filing List
          </button>
          <button
            onClick={() => {
              setCalendarView("month");
              alert("Switching to grid layout view...");
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              calendarView === "month" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Month Grid
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Calendar View Panel */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Calendar header search */}
          <div className="bg-card border border-border/40 p-3 rounded-xl shadow-sm flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute inset-y-0 left-0 pl-2.5 flex items-center w-4 h-4 my-auto text-muted-foreground" />
              <input
                type="text"
                placeholder="Search return type or taxpayer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-bold uppercase">
              <span>Selected Cycle:</span>
              <Badge variant="default">June 2026</Badge>
            </div>
          </div>

          {/* List display */}
          <Card className="px-0 py-2">
            {dueDates.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No pending tax returns scheduled.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Taxpayer Client</TableHead>
                    <TableHead>Filing Scope</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Filing Status</TableHead>
                    <TableHead className="text-right">Action Alert</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueDates.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-bold text-xs text-red-600 dark:text-red-400">
                        {new Date(d.dueDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="font-semibold text-xs truncate max-w-[150px]">{d.clientName}</TableCell>
                      <TableCell className="text-xs font-semibold text-primary">{d.type}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{d.period}</TableCell>
                      <TableCell>
                        <Badge variant={d.status === "FILED" ? "success" : d.status === "PENDING" ? "default" : "destructive"}>
                          {d.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {d.status !== "FILED" && (
                          <button
                            onClick={() => handleSendWhatsAppNotification(d.clientId, d.type, d.period, d.dueDate)}
                            className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold inline-flex items-center cursor-pointer"
                            title="Send WhatsApp alert"
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-0.5" /> WhatsApp Reminder
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

        </div>

        {/* Side panel: Reminder Configs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center"><Settings className="w-4.5 h-4.5 mr-2 text-primary" /> Auto Reminders Settings</CardTitle>
              <CardDescription>Configure practice alerts schedules dispatched to taxpayers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-muted/20 border border-border/40 rounded-lg">
                  <span className="font-semibold">WhatsApp Reminders</span>
                  <Badge variant="success">ENABLED</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Auto-dispatched via Meta API 5 days, 3 days, and 1 day prior to the return due date.
                </p>
              </div>

              <div className="space-y-2 border-t border-border/30 pt-3">
                <div className="flex justify-between items-center p-2.5 bg-muted/20 border border-border/40 rounded-lg">
                  <span className="font-semibold">Email PDF Challans</span>
                  <Badge variant="success">ENABLED</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Auto emails draft tax computations and payable challans to corporate directors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
