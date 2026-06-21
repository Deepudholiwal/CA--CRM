"use client";

import React, { useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import AINoticeAnalyzer from "../../components/ai/AINoticeAnalyzer";
import AITaxAssistant from "../../components/ai/AITaxAssistant";
import {
  Users,
  Percent,
  Landmark,
  Building2,
  CheckSquare,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  Calendar,
  MessageSquare,
  FileText,
  Activity,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Dashboard() {
  const {
    clients,
    filings,
    tasks,
    invoices,
    payments,
    employees,
    notices,
    whatsappLogs,
    activeBranch,
    checkPermission
  } = useDatabase();

  // 1. Dynamic Calculations based on Branch Filter
  const filteredClients = useMemo(() => 
    clients.filter(c => activeBranch === "all" || c.branchId === activeBranch),
    [clients, activeBranch]
  );

  const filteredFilings = useMemo(() => 
    filings.filter(f => {
      const client = clients.find(c => c.id === f.clientId);
      return client && (activeBranch === "all" || client.branchId === activeBranch);
    }),
    [filings, clients, activeBranch]
  );

  const filteredTasks = useMemo(() => 
    tasks.filter(t => {
      const client = clients.find(c => c.id === t.clientId);
      return !t.clientId || (client && (activeBranch === "all" || client.branchId === activeBranch));
    }),
    [tasks, clients, activeBranch]
  );

  const filteredInvoices = useMemo(() => 
    invoices.filter(i => activeBranch === "all" || i.branchId === activeBranch),
    [invoices, activeBranch]
  );

  const filteredNotices = useMemo(() => 
    notices.filter(n => {
      const client = clients.find(c => c.id === n.clientId);
      return client && (activeBranch === "all" || client.branchId === activeBranch);
    }),
    [notices, clients, activeBranch]
  );

  // KPIs
  const totalClientsCount = filteredClients.length;
  const activeClientsCount = filteredClients.filter((c) => c.status === "ACTIVE").length;
  
  const gstPendingCount = filteredFilings.filter((f) => f.module === "GST" && f.status === "PENDING").length;
  const itrPendingCount = filteredFilings.filter((f) => f.module === "ITR" && f.status === "PENDING").length;
  const rocPendingCount = filteredFilings.filter((f) => f.module === "ROC" && f.status === "PENDING").length;
  
  const activeTasksCount = filteredTasks.filter((t) => t.status !== "COMPLETED").length;
  
  const revenueThisMonth = useMemo(() => {
    // Sum PAID invoices generated in June 2026 (or just total paid invoices in active set)
    return filteredInvoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, current) => sum + current.total, 0);
  }, [filteredInvoices]);

  const outstandingRevenue = useMemo(() => {
    return filteredInvoices
      .filter((i) => i.status === "UNPAID" || i.status === "PARTIALLY_PAID")
      .reduce((sum, current) => {
        const paidAmount = payments
          .filter((p) => p.invoiceId === current.id)
          .reduce((pSum, pCurr) => pSum + pCurr.amount, 0);
        return sum + (current.total - paidAmount);
      }, 0);
  }, [filteredInvoices, payments]);

  const averageStaffProductivity = useMemo(() => {
    const branchStaff = employees.filter(e => activeBranch === "all" || e.branchId === activeBranch);
    if (branchStaff.length === 0) return 85;
    const totalScore = branchStaff.reduce((sum, curr) => sum + curr.performanceScore, 0);
    return Math.round(totalScore / branchStaff.length);
  }, [employees, activeBranch]);

  const overallComplianceScore = useMemo(() => {
    const totalFilings = filteredFilings.length;
    if (totalFilings === 0) return 100;
    const filedCount = filteredFilings.filter((f) => f.status === "FILED").length;
    return Math.round((filedCount / totalFilings) * 100);
  }, [filteredFilings]);

  // Chart Data preparation
  const monthlyRevenueData = [
    { name: "Jan", Revenue: 240000, Collections: 210000 },
    { name: "Feb", Revenue: 310000, Collections: 290000 },
    { name: "Mar", Revenue: 450000, Collections: 420000 },
    { name: "Apr", Revenue: 280000, Collections: 250000 },
    { name: "May", Revenue: 380000, Collections: 340000 },
    { name: "Jun", Revenue: revenueThisMonth || 420000, Collections: (revenueThisMonth * 0.85) || 360000 },
  ];

  const filingStatusData = [
    { name: "Filed", value: filteredFilings.filter((f) => f.status === "FILED").length, color: "#10b981" },
    { name: "Pending", value: filteredFilings.filter((f) => f.status === "PENDING").length, color: "#3b82f6" },
    { name: "In Progress", value: filteredFilings.filter((f) => f.status === "IN_PROGRESS").length, color: "#f59e0b" },
    { name: "Overdue", value: filteredFilings.filter((f) => f.status === "OVERDUE").length, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Practice Dashboard</h2>
          <p className="text-xs text-muted-foreground">
            Overview of firm health, critical deadlines, and employee performance metrics.
          </p>
        </div>
        <div className="text-xs font-semibold text-muted-foreground flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-primary mr-1" />
          <span>June 2026 Reporting Cycle</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <Card hoverEffect className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Clients</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold tracking-tight">{totalClientsCount}</h3>
            <span className="text-[9px] text-emerald-500 font-semibold">Active: {activeClientsCount}</span>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card hoverEffect className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">GST Overdue/Pend</span>
            <Percent className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold tracking-tight text-amber-500">{gstPendingCount}</h3>
            <span className="text-[9px] text-muted-foreground">Pending return filings</span>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card hoverEffect className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">ITR Pending</span>
            <Landmark className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold tracking-tight text-blue-500">{itrPendingCount}</h3>
            <span className="text-[9px] text-muted-foreground">ITR-5/6 AY 2026-27</span>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card hoverEffect className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Mtd Collections</span>
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold tracking-tight text-emerald-500">₹{revenueThisMonth.toLocaleString("en-IN")}</h3>
            <span className="text-[9px] text-red-500 font-bold">Unpaid: ₹{outstandingRevenue.toLocaleString("en-IN")}</span>
          </div>
        </Card>

        {/* KPI 5 */}
        <Card hoverEffect className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Compliance Score</span>
            <FileCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold tracking-tight">{overallComplianceScore}%</h3>
            <span className="text-[9px] text-muted-foreground">Avg staff productivity: {averageStaffProductivity}%</span>
          </div>
        </Card>
      </div>

      {/* Main Charts & Analytics Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center"><TrendingUp className="w-4.5 h-4.5 mr-2 text-primary" /> Billing & Revenue Analytics</CardTitle>
            <CardDescription>Comparison of generated billings vs collected professional fees (6 months period).</CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/40)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} labelStyle={{ fontSize: 10, fontWeight: "bold" }} itemStyle={{ fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Collections" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Filings Status Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center"><FileText className="w-4.5 h-4.5 mr-2 text-primary" /> Return filings Division</CardTitle>
            <CardDescription>Overview of active GST, ITR, TDS and ROC return filing statuses.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-between pt-4">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {filingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} itemStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-border/40 pt-3">
              {filingStatusData.map((d, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="font-medium text-slate-400">{d.name}</span>
                  <span className="font-bold text-foreground ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Notices, Tasks, and AI Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Due Dates & Notices */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/40">
            <div>
              <CardTitle className="text-sm font-bold flex items-center">
                <AlertTriangle className="w-4.5 h-4.5 mr-2 text-red-500 animate-bounce" /> 
                Critical Scrutiny Notices & Due Dates
              </CardTitle>
              <CardDescription>Immediate action required for outstanding legal notifications.</CardDescription>
            </div>
            <Link href="/gst" className="text-xs text-primary font-bold hover:underline flex items-center">
              Filing Room <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="pt-2 px-0">
            {filteredNotices.filter(n => n.status !== "CLOSED").length === 0 ? (
              <p className="text-xs text-muted-foreground p-6 text-center">No outstanding tax notices mapped to this branch.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotices.filter(n => n.status !== "CLOSED").map((n) => (
                    <TableRow key={n.id}>
                      <TableCell className="font-semibold text-xs truncate max-w-[140px]" title={n.clientName}>
                        {n.clientName}
                      </TableCell>
                      <TableCell className="text-xs">{n.issuingAuthority}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{n.noticeSection}</TableCell>
                      <TableCell className="text-xs font-bold text-red-600 dark:text-red-400">
                        {new Date(n.dueDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={n.severity === "HIGH" ? "destructive" : "warning"}>
                          {n.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* AI Notice Analyzer Widget */}
        <AINoticeAnalyzer />

      </div>

      {/* Secondary Row: Activity timeline, Team perform, AI Chat assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Team Performance Widget */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center"><Users className="w-4.5 h-4.5 mr-2 text-primary" /> Staff Performance Tracker</CardTitle>
            <CardDescription>Productivity score and active task allocations by branch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {employees
              .filter(e => activeBranch === "all" || e.branchId === activeBranch)
              .slice(0, 4)
              .map((e) => {
                const staffTasksCount = filteredTasks.filter((t) => t.assignedToId === e.id && t.status !== "COMPLETED").length;
                return (
                  <div key={e.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{e.name}</span>
                      <span className="text-muted-foreground">{staffTasksCount} pending tasks • {e.performanceScore}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${e.performanceScore}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Recent Activity Log */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center"><Activity className="w-4.5 h-4.5 mr-2 text-primary" /> Recent Communications & Activity</CardTitle>
            <CardDescription>WhatsApp alerts and portal audit logs timeline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 pt-4 max-h-[260px] overflow-y-auto pr-1">
            {whatsappLogs.slice(0, 4).map((wl) => (
              <div key={wl.id} className="flex items-start space-x-2.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1 shadow-sm"></div>
                <div className="flex-1 space-y-0.5">
                  <p className="font-semibold text-foreground">{wl.clientName}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{wl.message}</p>
                  <span className="text-[9px] text-slate-500 font-medium block pt-0.5">{wl.timestamp} • WhatsApp Out</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Tax Assistant Widget */}
        <AITaxAssistant />

      </div>

    </div>
  );
}
