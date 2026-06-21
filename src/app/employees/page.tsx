"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  UserCheck2,
  DollarSign,
  Briefcase,
  AlertCircle,
  Percent,
  Check,
  X
} from "lucide-react";

interface MockLeaveRequest {
  id: string;
  employeeName: string;
  designation: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function EmployeesPage() {
  const { employees, activeBranch, branches } = useDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Mock Leave Requests state
  const [leaves, setLeaves] = useState<MockLeaveRequest[]>([
    { id: "lv-1", employeeName: "Vikram Singh", designation: "Data Entry Operator", startDate: "2026-06-25", endDate: "2026-06-27", type: "Casual Leave", reason: "Family wedding at native place.", status: "PENDING" },
    { id: "lv-2", employeeName: "Ananya Sharma", designation: "Audit Manager", startDate: "2026-07-05", endDate: "2026-07-10", type: "Sick Leave", reason: "Medical surgery recovery check.", status: "PENDING" },
    { id: "lv-3", employeeName: "Amit Patel", designation: "Taxation Specialist", startDate: "2026-06-02", endDate: "2026-06-03", type: "Casual Leave", reason: "Personal emergency.", status: "APPROVED" },
  ]);

  // Filters Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchBranch = activeBranch === "all" || e.branchId === activeBranch;
      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "all" || e.role === roleFilter;

      return matchBranch && matchSearch && matchRole;
    });
  }, [employees, activeBranch, searchQuery, roleFilter]);

  // Attendance metrics
  const todayAttendance = [
    { id: "att-1", name: "Deepak Yadav", role: "CA Partner", checkIn: "09:15 AM", status: "PRESENT" },
    { id: "att-2", name: "Ananya Sharma", role: "Audit Manager", checkIn: "09:30 AM", status: "PRESENT" },
    { id: "att-3", name: "Amit Patel", role: "Tax Consultant", checkIn: "09:20 AM", status: "PRESENT" },
    { id: "att-4", name: "Priya Nair", role: "Accountant", checkIn: "09:40 AM", status: "PRESENT" },
    { id: "att-5", name: "Vikram Singh", role: "Data Entry", checkIn: "--", status: "ON_LEAVE" },
  ];

  const handleLeaveDecision = (leaveId: string, status: "APPROVED" | "REJECTED") => {
    setLeaves((prev) =>
      prev.map((lv) => (lv.id === leaveId ? { ...lv, status } : lv))
    );
    alert(`Leave application marked as ${status}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <UserCheck className="w-6 h-6 mr-2 text-primary" /> Employees Workspace & HR Management
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage staff profiles, track practice performance ratings, approve casual leaves, and review daily biometric check-ins.
        </p>
      </div>

      {/* Main Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Employees Directory Grid */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 p-4 rounded-xl shadow-sm">
            <div className="flex flex-1 items-center space-x-2 max-w-sm">
              <div className="relative w-full">
                <Search className="absolute inset-y-0 left-0 pl-3 flex items-center w-4 h-4 my-auto text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search employee or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="CA_PARTNER">CA Partner</option>
                <option value="MANAGER">Manager</option>
                <option value="TAX_CONSULTANT">Tax Consultant</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="DATA_ENTRY">Data Entry</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <Card className="px-0 py-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Code</TableHead>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Corporate Mobile</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Branch Office</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs font-semibold text-primary">{e.employeeId}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">{e.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">{e.email}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground">{e.designation}</TableCell>
                    <TableCell className="text-xs">{e.mobile}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1.5 text-xs">
                        <div className="w-16 bg-muted h-1 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${e.performanceScore}%` }}></div>
                        </div>
                        <span className="font-bold">{e.performanceScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-500">
                      {branches.find(b => b.id === e.branchId)?.name.split(" ")[0]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

        </div>

        {/* HR leave request panel & Biometrics */}
        <div className="space-y-6">
          
          {/* Leaves approvals panel */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center text-primary"><Calendar className="w-4.5 h-4.5 mr-2" /> Leaves approval logs</CardTitle>
              <CardDescription>Review employee leave requests.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 max-h-[280px] overflow-y-auto pr-1">
              {leaves.map((l) => (
                <div key={l.id} className="p-3 border border-border/40 bg-card rounded-lg text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-foreground block">{l.employeeName}</span>
                      <span className="text-[9px] text-slate-500 font-medium">{l.designation} • {l.type}</span>
                    </div>
                    <Badge variant={l.status === "APPROVED" ? "success" : l.status === "PENDING" ? "default" : "destructive"}>
                      {l.status}
                    </Badge>
                  </div>

                  <p className="text-[10px] text-muted-foreground italic leading-snug">
                    "{l.reason}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold pt-1 border-t border-border/20 mt-2">
                    <span>{l.startDate} to {l.endDate}</span>
                    
                    {l.status === "PENDING" && (
                      <div className="flex space-x-1.5">
                        <button
                          onClick={() => handleLeaveDecision(l.id, "APPROVED")}
                          className="p-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded cursor-pointer"
                          title="Approve leave"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleLeaveDecision(l.id, "REJECTED")}
                          className="p-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded cursor-pointer"
                          title="Reject leave"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daily biometric attendance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center"><UserCheck2 className="w-4.5 h-4.5 mr-2 text-primary" /> Biometric Attendance</CardTitle>
              <CardDescription>Daily check-in logs for active branch staff.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((a, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-xs">{a.name}</TableCell>
                      <TableCell className="text-xs font-mono">{a.checkIn}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === "PRESENT" ? "success" : "secondary"}>
                          {a.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
