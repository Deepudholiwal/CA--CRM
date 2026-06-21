"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import {
  BarChart3,
  Download,
  Users,
  Percent,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  Building,
  CheckCircle,
  FileText,
  UserCheck
} from "lucide-react";

export default function ReportsPage() {
  const {
    clients,
    filings,
    invoices,
    employees,
    activeBranch
  } = useDatabase();

  const [activeReport, setActiveReport] = useState<"revenue" | "gst" | "employee" | "client">("revenue");

  // Filter lists based on active branch selection
  const filteredClients = useMemo(() => clients.filter(c => activeBranch === "all" || c.branchId === activeBranch), [clients, activeBranch]);
  const filteredInvoices = useMemo(() => invoices.filter(i => activeBranch === "all" || i.branchId === activeBranch), [invoices, activeBranch]);
  const filteredEmployees = useMemo(() => employees.filter(e => activeBranch === "all" || e.branchId === activeBranch), [employees, activeBranch]);
  const filteredFilings = useMemo(() => filings.filter(f => {
    const client = clients.find(c => c.id === f.clientId);
    return client && (activeBranch === "all" || client.branchId === activeBranch);
  }), [filings, clients, activeBranch]);

  // Export handlers
  const handleExport = (type: "pdf" | "csv" | "excel") => {
    alert(`Compiling ${activeReport.toUpperCase()} report registers. Exporting as ${type.toUpperCase()} file...`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-primary" /> Reports & Analytics Center
          </h2>
          <p className="text-xs text-muted-foreground">
            Generate audited summaries of firm financials, return filings logs, and consultant performance ratings.
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport("csv")}
            className="px-3 py-1.5 border border-border/60 hover:bg-muted text-foreground text-xs font-semibold rounded-lg flex items-center cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="px-3 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg flex items-center cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1" /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60 pb-1">
        <button
          onClick={() => setActiveReport("revenue")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeReport === "revenue" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center"><TrendingUp className="w-4 h-4 mr-1.5" /> Revenue & collections</span>
        </button>
        <button
          onClick={() => setActiveReport("gst")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeReport === "gst" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center"><Percent className="w-4 h-4 mr-1.5" /> GST & Tax filings</span>
        </button>
        <button
          onClick={() => setActiveReport("employee")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeReport === "employee" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center"><UserCheck className="w-4 h-4 mr-1.5" /> Employee performance</span>
        </button>
        <button
          onClick={() => setActiveReport("client")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeReport === "client" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> Client Demographics</span>
        </button>
      </div>

      {/* REPORT 1: REVENUE */}
      {activeReport === "revenue" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Monthly billing report</CardTitle>
            <CardDescription>Consolidated statement of fee receipts, SGST, CGST and outstanding balances.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>SubTotal</TableHead>
                  <TableHead>SGST/CGST</TableHead>
                  <TableHead>Total sum</TableHead>
                  <TableHead>Filing Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs font-semibold text-primary">{inv.invoiceNo}</TableCell>
                    <TableCell className="font-semibold text-xs">{inv.clientName}</TableCell>
                    <TableCell className="text-xs">₹{inv.subTotal.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">₹{(inv.cgst + inv.sgst + inv.igst).toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-xs font-bold text-foreground">₹{inv.total.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === "PAID" ? "success" : "destructive"}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* REPORT 2: GST FILINGS */}
      {activeReport === "gst" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Filing compliance audit log</CardTitle>
            <CardDescription>Departmental track record of GST, ITR, and TDS return dates.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Return Form</TableHead>
                  <TableHead>Filing Period</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submission Reference (ARN/ACK)</TableHead>
                  <TableHead>Filing Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFilings.map((fil) => (
                  <TableRow key={fil.id}>
                    <TableCell className="font-semibold text-xs">{fil.clientName}</TableCell>
                    <TableCell className="text-xs font-semibold text-primary">{fil.module}</TableCell>
                    <TableCell className="text-xs font-semibold">{fil.type}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fil.period}</TableCell>
                    <TableCell className="text-xs font-semibold">{fil.dueDate}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[150px]">{fil.referenceNo || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={fil.status === "FILED" ? "success" : "default"}>
                        {fil.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* REPORT 3: EMPLOYEE */}
      {activeReport === "employee" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Team productivity report</CardTitle>
            <CardDescription>Overview of employee tasks performance ratings and joining dates.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Salary Package</TableHead>
                  <TableHead>Biometric Performance Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-semibold text-xs">{e.name}</TableCell>
                    <TableCell className="text-xs font-semibold text-muted-foreground">{e.designation}</TableCell>
                    <TableCell className="text-xs">{e.joiningDate}</TableCell>
                    <TableCell className="text-xs font-bold text-foreground">₹{e.salary?.toLocaleString("en-IN") || "N/A"}/mo</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1.5 text-xs">
                        <div className="w-24 bg-muted h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${e.performanceScore}%` }}></div>
                        </div>
                        <span className="font-bold text-primary">{e.performanceScore}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* REPORT 4: CLIENT DEMOGRAPHICS */}
      {activeReport === "client" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Corporate taxpayer registers</CardTitle>
            <CardDescription>Onboarded clients breakdown by business types and tax tags.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>GSTIN Code</TableHead>
                  <TableHead>PAN Card</TableHead>
                  <TableHead>Business Category</TableHead>
                  <TableHead>Onboarding Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold text-xs">{c.name}</TableCell>
                    <TableCell className="text-xs font-mono font-semibold text-primary">{c.gstin || "N/A"}</TableCell>
                    <TableCell className="text-xs font-mono">{c.pan}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{c.businessType.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
