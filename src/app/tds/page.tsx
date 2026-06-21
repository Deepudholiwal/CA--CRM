"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import {
  FileSpreadsheet,
  Search,
  CheckCircle,
  FileCheck,
  Calendar,
  Filter,
  Check,
  Download,
  AlertTriangle,
  Building
} from "lucide-react";

export default function TDSPage() {
  const {
    clients,
    filings,
    activeBranch,
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState("");
  const [formFilter, setFormFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showFilingModal, setShowFilingModal] = useState(false);
  const [selectedFiling, setSelectedFiling] = useState<any | null>(null);
  const [receiptNo, setReceiptNo] = useState("");
  const [challanAmt, setChallanAmt] = useState("");

  // Filters TDS filings
  const filteredTdsFilings = useMemo(() => {
    return filings.filter((f) => {
      if (f.module !== "TDS") return false;
      const client = clients.find((c) => c.id === f.clientId);
      const matchBranch = activeBranch === "all" || (client && client.branchId === activeBranch);
      
      const matchSearch =
        f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchForm = formFilter === "all" || f.type === formFilter;
      const matchStatus = statusFilter === "all" || f.status === statusFilter;

      return matchBranch && matchSearch && matchForm && matchStatus;
    });
  }, [filings, clients, activeBranch, searchQuery, formFilter, statusFilter]);

  // TAN details mapping
  const tanClients = useMemo(() => {
    return clients.filter((c) => c.tan && (activeBranch === "all" || c.branchId === activeBranch));
  }, [clients, activeBranch]);

  // Mock Challan history
  const challanHistory = [
    { id: "ch-1", clientName: "Acme Tech Solutions Private Limited", bsrCode: "0210291", challanNo: "50239", amount: 75000, date: "2026-05-28", section: "Sec 192 (Salary)" },
    { id: "ch-2", clientName: "Zenith Bangalore Developers LLP", bsrCode: "0291028", challanNo: "44120", amount: 35000, date: "2026-06-15", section: "Sec 194C (Contractors)" },
  ];

  const handleOpenFilingModal = (filing: any) => {
    setSelectedFiling(filing);
    setReceiptNo("");
    setChallanAmt("");
    setShowFilingModal(true);
  };

  const handleMarkAsFiled = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiling || !receiptNo) return;

    selectedFiling.status = "FILED";
    selectedFiling.referenceNo = receiptNo;
    selectedFiling.filedDate = new Date().toISOString().split("T")[0];
    selectedFiling.taxPaid = parseFloat(challanAmt) || null;

    setShowFilingModal(false);
    alert("TDS return filed successfully! Receipt logged.");
  };

  const handleDownloadForm16 = (clientName: string) => {
    alert(`Compiling salary data & TDS certificates (Form 16/16A) for ${clientName}... Download initiated!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <FileSpreadsheet className="w-6 h-6 mr-2 text-primary" /> TDS Returns & TAN Registry
        </h2>
        <p className="text-xs text-muted-foreground">
          Prepare Form 24Q (Salary), Form 26Q (Non-Salary) quarterly returns, register TAN numbers, and dispatch Form 16A certificates.
        </p>
      </div>

      {/* Main Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Return filings registry */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 border-b border-border/40 mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-bold">Quarterly TDS returns</CardTitle>
                <CardDescription>Track Form 24Q, 26Q return submission deadlines.</CardDescription>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2">
                <select
                  value={formFilter}
                  onChange={(e) => setFormFilter(e.target.value)}
                  className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="all">All Forms</option>
                  <option value="Form 24Q">Form 24Q (Salary)</option>
                  <option value="Form 26Q">Form 26Q (Fees)</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="FILED">Filed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {filteredTdsFilings.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No matching TDS filings found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deductor Client</TableHead>
                    <TableHead>Form Type</TableHead>
                    <TableHead>Quarter / Period</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Receipt / ARN</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTdsFilings.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-semibold text-xs truncate max-w-[150px]">{f.clientName}</TableCell>
                      <TableCell className="text-xs font-semibold">{f.type}</TableCell>
                      <TableCell className="text-xs">{f.period}</TableCell>
                      <TableCell className="text-xs font-semibold">{f.dueDate}</TableCell>
                      <TableCell className="text-xs font-mono truncate max-w-[120px] text-muted-foreground">{f.referenceNo || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={f.status === "FILED" ? "success" : "default"}>
                          {f.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {f.status !== "FILED" ? (
                            <button
                              onClick={() => handleOpenFilingModal(f)}
                              className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold inline-flex items-center cursor-pointer"
                            >
                              <Check className="w-3 h-3 mr-0.5" /> File
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDownloadForm16(f.clientName)}
                              className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-bold flex items-center cursor-pointer"
                              title="Download Form 16 / 16A"
                            >
                              <Download className="w-3.5 h-3.5 mr-0.5" /> Form 16
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

        {/* Side panel: TAN registry */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center"><Building className="w-4.5 h-4.5 mr-2 text-primary" /> Active TAN Registry</CardTitle>
              <CardDescription>Firm clients registered for Tax Collection & Deduction accounts.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {tanClients.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No TAN numbers mapped.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>TAN Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tanClients.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-semibold text-xs truncate max-w-[120px]">{c.name}</TableCell>
                        <TableCell className="text-xs font-mono font-semibold text-primary">{c.tan}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Challan table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">TDS Challan Deposit Tracking</CardTitle>
          <CardDescription>Log challan payments submitted at authorized bank branches under Challan 281.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>TDS Section</TableHead>
                <TableHead>Deposit Date</TableHead>
                <TableHead>Challan Amount</TableHead>
                <TableHead>Challan No.</TableHead>
                <TableHead>BSR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challanHistory.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-semibold text-xs">{c.clientName}</TableCell>
                  <TableCell className="text-xs">{c.section}</TableCell>
                  <TableCell className="text-xs">{c.date}</TableCell>
                  <TableCell className="text-xs font-bold text-foreground">₹{c.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs font-mono">{c.challanNo}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{c.bsrCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* File TDS Modal */}
      <Modal isOpen={showFilingModal} onClose={() => setShowFilingModal(false)} title="Enter TDS filing references">
        <form onSubmit={handleMarkAsFiled} className="space-y-4">
          <div className="bg-muted/10 p-3 rounded-lg border border-border/60 mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Deductor client</span>
            <span className="text-sm font-semibold text-foreground">{selectedFiling?.clientName}</span>
            <span className="text-xs text-muted-foreground block mt-0.5">Return Type: {selectedFiling?.type} • Due Date: {selectedFiling?.dueDate}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">PRN / Receipt Number *</label>
              <input
                type="text"
                required
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                placeholder="PRN-99812-XXXX"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Total Challan Deposited (₹)</label>
              <input
                type="number"
                value={challanAmt}
                onChange={(e) => setChallanAmt(e.target.value)}
                placeholder="75000"
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
              Confirm TDS Filing
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
