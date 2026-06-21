"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import {
  Percent,
  Search,
  MessageSquare,
  CheckCircle,
  FileCheck,
  AlertTriangle,
  Send,
  Calendar,
  Filter,
  Check,
  Building,
  ExternalLink
} from "lucide-react";

export default function GSTPage() {
  const {
    clients,
    filings,
    notices,
    activeBranch,
    sendWhatsAppNotification,
    checkPermission
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState("");
  const [returnFilter, setReturnFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFiling, setSelectedFiling] = useState<any | null>(null);
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [arn, setArn] = useState("");
  const [taxPaid, setTaxPaid] = useState("");

  // Filters GST filings mapped to active branch
  const filteredGstFilings = useMemo(() => {
    return filings.filter((f) => {
      if (f.module !== "GST") return false;
      const client = clients.find((c) => c.id === f.clientId);
      const matchBranch = activeBranch === "all" || (client && client.branchId === activeBranch);
      
      const matchSearch =
        f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.referenceNo && f.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchReturn = returnFilter === "all" || f.type === returnFilter;
      const matchStatus = statusFilter === "all" || f.status === statusFilter;

      return matchBranch && matchSearch && matchReturn && matchStatus;
    });
  }, [filings, clients, activeBranch, searchQuery, returnFilter, statusFilter]);

  // Filters GST Notices
  const gstNotices = useMemo(() => {
    return notices.filter((n) => {
      if (n.issuingAuthority !== "GST") return false;
      const client = clients.find((c) => c.id === n.clientId);
      return activeBranch === "all" || (client && client.branchId === activeBranch);
    });
  }, [notices, clients, activeBranch]);

  // Statistics
  const registeredGstClientsCount = clients.filter(
    (c) => c.gstin && (activeBranch === "all" || c.branchId === activeBranch)
  ).length;
  
  const filedGstCount = filteredGstFilings.filter((f) => f.status === "FILED").length;
  const overdueGstCount = filteredGstFilings.filter((f) => f.status === "OVERDUE").length;
  const pendingGstCount = filteredGstFilings.filter((f) => f.status === "PENDING").length;

  const handleSendReminder = (clientId: string, type: string, period: string, dueDate: string) => {
    const msg = `Dear Client, your GST Return ${type} for ${period} is pending. The due date is ${dueDate}. Please share your sales register and bank statements. Regards, Deepak Yadav & Associates.`;
    sendWhatsAppNotification(clientId, msg);
    alert("WhatsApp due reminder dispatched successfully!");
  };

  const handleOpenFilingModal = (filing: any) => {
    setSelectedFiling(filing);
    setArn("");
    setTaxPaid("");
    setShowFilingModal(true);
  };

  const handleMarkAsFiled = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiling || !arn) return;

    // Simulate updating filing status in context
    selectedFiling.status = "FILED";
    selectedFiling.referenceNo = arn;
    selectedFiling.filedDate = new Date().toISOString().split("T")[0];
    selectedFiling.taxPaid = parseFloat(taxPaid) || null;

    setShowFilingModal(false);
    alert("Filing record updated with ARN reference!");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <Percent className="w-6 h-6 mr-2 text-primary" /> GST Returns & Scrutiny Panel
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage monthly GSTR-1 & GSTR-3B filings, track input tax credits, and log ARN submission challans.
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">GST Reg Clients</span>
            <h3 className="text-2xl font-bold text-foreground mt-1">{registeredGstClientsCount}</h3>
          </div>
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Filed This Month</span>
            <h3 className="text-2xl font-bold text-emerald-500 mt-1">{filedGstCount}</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">GST Overdue</span>
            <h3 className="text-2xl font-bold text-red-500 mt-1">{overdueGstCount}</h3>
          </div>
          <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Pending Filings</span>
            <h3 className="text-2xl font-bold text-blue-500 mt-1">{pendingGstCount}</h3>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Filings Board */}
      <Card>
        <CardHeader className="pb-2 border-b border-border/40 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold">Filing Registry</CardTitle>
              <CardDescription>Track monthly, quarterly, and annual GST return compliance status.</CardDescription>
            </div>
            
            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-2.5 flex items-center w-4 h-4 my-auto text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search client or ARN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-2 py-1 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <select
                value={returnFilter}
                onChange={(e) => setReturnFilter(e.target.value)}
                className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Returns</option>
                <option value="GSTR-1">GSTR-1</option>
                <option value="GSTR-3B">GSTR-3B</option>
                <option value="GSTR-4">GSTR-4 (Composition)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="FILED">Filed</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {filteredGstFilings.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No matching GST filings found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Return Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Filed Date</TableHead>
                  <TableHead>GST paid</TableHead>
                  <TableHead>ARN / Ref</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGstFilings.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-semibold text-xs truncate max-w-[150px]">{f.clientName}</TableCell>
                    <TableCell className="text-xs font-semibold">{f.type}</TableCell>
                    <TableCell className="text-xs">{f.period}</TableCell>
                    <TableCell className="text-xs font-semibold">{f.dueDate}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{f.filedDate || "--"}</TableCell>
                    <TableCell className="text-xs">{f.taxPaid ? `₹${f.taxPaid.toLocaleString("en-IN")}` : "N/A"}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[120px]">{f.referenceNo || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={f.status === "FILED" ? "success" : f.status === "PENDING" ? "default" : f.status === "IN_PROGRESS" ? "info" : "destructive"}>
                        {f.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {f.status !== "FILED" && (
                          <button
                            onClick={() => handleOpenFilingModal(f)}
                            className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold flex items-center cursor-pointer"
                          >
                            <Check className="w-3 h-3 mr-0.5" /> File GSTR
                          </button>
                        )}
                        {(f.status === "PENDING" || f.status === "OVERDUE") && (
                          <button
                            onClick={() => handleSendReminder(f.clientId, f.type, f.period, f.dueDate)}
                            className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-bold flex items-center cursor-pointer"
                            title="WhatsApp Due Alert"
                          >
                            <MessageSquare className="w-3 h-3 mr-0.5" /> Remind
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* GST notices tracker */}
      <Card className="border border-red-500/20 bg-red-500/[0.01]">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4.5 h-4.5 mr-2" /> Active GST Scrutiny Notices
          </CardTitle>
          <CardDescription>Track GST ASMT-10 discrepancy responses and penalty appeals.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {gstNotices.length === 0 ? (
            <p className="text-xs text-muted-foreground p-6 text-center">No outstanding GST notices mapped to this branch.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Notice Section</TableHead>
                  <TableHead>Notice ID</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gstNotices.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-semibold text-xs truncate max-w-[150px]">{n.clientName}</TableCell>
                    <TableCell className="text-xs font-semibold">{n.noticeSection}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{n.noticeNumber}</TableCell>
                    <TableCell className="text-xs text-red-600 dark:text-red-400 font-bold">{n.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{n.status}</Badge>
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

      {/* File Return Modal */}
      <Modal isOpen={showFilingModal} onClose={() => setShowFilingModal(false)} title={`Enter Filing References: ${selectedFiling?.type}`}>
        <form onSubmit={handleMarkAsFiled} className="space-y-4">
          <div className="bg-muted/10 p-3 rounded-lg border border-border/60 mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Filing Entity</span>
            <span className="text-sm font-semibold text-foreground">{selectedFiling?.clientName}</span>
            <span className="text-xs text-muted-foreground block mt-0.5">Period: {selectedFiling?.period} • Due Date: {selectedFiling?.dueDate}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">ARN (Application Reference Number) *</label>
              <input
                type="text"
                required
                value={arn}
                onChange={(e) => setArn(e.target.value)}
                placeholder="ARN-AA-06-26-XXXX"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Challan Tax Paid (₹)</label>
              <input
                type="number"
                value={taxPaid}
                onChange={(e) => setTaxPaid(e.target.value)}
                placeholder="45000"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setShowFilingModal(false)}
              className="px-3 py-1.5 border border-border/60 text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm"
            >
              Submit ARN reference
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
