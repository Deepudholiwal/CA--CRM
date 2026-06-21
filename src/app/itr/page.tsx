"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import {
  Landmark,
  Search,
  Upload,
  Cpu,
  Eye,
  AlertTriangle,
  Calendar,
  CheckCircle,
  FileCheck,
  Check,
  FileText,
  Loader2
} from "lucide-react";

export default function ITRPage() {
  const {
    clients,
    filings,
    notices,
    activeBranch,
    checkPermission
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState("");
  const [itrFilter, setItrFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // OCR Form 16 States
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);
  const [selectedClientForOcr, setSelectedClientForOcr] = useState("");

  // Filing Modal
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [selectedFiling, setSelectedFiling] = useState<any | null>(null);
  const [ackNo, setAckNo] = useState("");
  const [taxPayable, setTaxPayable] = useState("");
  const [refundClaimed, setRefundClaimed] = useState("");

  // Filters ITR filings
  const filteredItrFilings = useMemo(() => {
    return filings.filter((f) => {
      if (f.module !== "ITR") return false;
      const client = clients.find((c) => c.id === f.clientId);
      const matchBranch = activeBranch === "all" || (client && client.branchId === activeBranch);
      
      const matchSearch =
        f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.referenceNo && f.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchItr = itrFilter === "all" || f.type === itrFilter;
      const matchStatus = statusFilter === "all" || f.status === statusFilter;

      return matchBranch && matchSearch && matchItr && matchStatus;
    });
  }, [filings, clients, activeBranch, searchQuery, itrFilter, statusFilter]);

  // Filters IT Notices
  const itNotices = useMemo(() => {
    return notices.filter((n) => {
      if (n.issuingAuthority !== "INCOME_TAX") return false;
      const client = clients.find((c) => c.id === n.clientId);
      return activeBranch === "all" || (client && client.branchId === activeBranch);
    });
  }, [notices, clients, activeBranch]);

  // Metrics
  const itClientsCount = clients.filter(
    (c) => activeBranch === "all" || c.branchId === activeBranch
  ).length;
  
  const filedCount = filteredItrFilings.filter((f) => f.status === "FILED").length;
  const pendingCount = filteredItrFilings.filter((f) => f.status === "PENDING").length;
  const progressCount = filteredItrFilings.filter((f) => f.status === "IN_PROGRESS").length;

  const handleOpenFilingModal = (filing: any) => {
    setSelectedFiling(filing);
    setAckNo("");
    setTaxPayable("");
    setRefundClaimed("");
    setShowFilingModal(true);
  };

  const handleMarkAsFiled = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiling || !ackNo) return;

    selectedFiling.status = "FILED";
    selectedFiling.referenceNo = ackNo;
    selectedFiling.filedDate = new Date().toISOString().split("T")[0];
    selectedFiling.taxPaid = parseFloat(taxPayable) || 0; // standard field update

    setShowFilingModal(false);
    alert("ITR return filed successfully! Acknowledgement reference logged.");
  };

  const handleRunOcr = () => {
    if (!selectedClientForOcr) return;
    setOcrScanning(true);
    setOcrResult(null);

    setTimeout(() => {
      setOcrScanning(false);
      setOcrResult({
        assessmentYear: "AY 2026-27",
        employerName: "Infosys Technologies Limited",
        tanOfEmployer: "BLRI09128D",
        grossSalary: 1250000,
        deductionsUnder80C: 150000,
        taxDeductedAtSource: 85400,
        suggestedItrType: "ITR-1 (Salaried)"
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
            <Landmark className="w-6 h-6 mr-2 text-primary" /> Income Tax (ITR) Workspace
          </h2>
          <p className="text-xs text-muted-foreground">
            Process Assessment Year 2026-27 tax returns, verify Form 26AS/AIS summaries, and run Form 16 OCR.
          </p>
        </div>
        
        <button
          onClick={() => {
            setSelectedClientForOcr("");
            setOcrResult(null);
            setShowOcrModal(true);
          }}
          className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center cursor-pointer shadow-sm self-start md:self-center"
        >
          <Upload className="w-4 h-4 mr-1.5" /> AI OCR Form 16 upload
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Registered Taxpayers</span>
            <h3 className="text-2xl font-bold text-foreground mt-1">{itClientsCount}</h3>
          </div>
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">ITRs Filed (AY 26-27)</span>
            <h3 className="text-2xl font-bold text-emerald-500 mt-1">{filedCount}</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">In Compilation</span>
            <h3 className="text-2xl font-bold text-blue-500 mt-1">{progressCount}</h3>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Pending Filings</span>
            <h3 className="text-2xl font-bold text-slate-500 mt-1">{pendingCount}</h3>
          </div>
          <div className="w-10 h-10 bg-slate-500/10 text-slate-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Filings Board */}
      <Card>
        <CardHeader className="pb-2 border-b border-border/40 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold">ITR Filing Register</CardTitle>
              <CardDescription>Verify ITR types, assessment years, and submission acknowledgements.</CardDescription>
            </div>
            
            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-2.5 flex items-center w-4 h-4 my-auto text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search taxpayer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-2 py-1 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <select
                value={itrFilter}
                onChange={(e) => setItrFilter(e.target.value)}
                className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Forms</option>
                <option value="ITR-1">ITR-1 (Salary)</option>
                <option value="ITR-3">ITR-3 (Proprietor)</option>
                <option value="ITR-5">ITR-5 (Partnership)</option>
                <option value="ITR-6">ITR-6 (Corporate)</option>
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
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {filteredItrFilings.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No matching ITR return records found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Taxpayer Name</TableHead>
                  <TableHead>ITR type</TableHead>
                  <TableHead>Assessment Year</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Filed Date</TableHead>
                  <TableHead>Acknowledgement Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItrFilings.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-semibold text-xs truncate max-w-[160px]">{f.clientName}</TableCell>
                    <TableCell className="text-xs font-semibold">{f.type}</TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground">{f.period}</TableCell>
                    <TableCell className="text-xs font-semibold">{f.dueDate}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{f.filedDate || "--"}</TableCell>
                    <TableCell className="text-xs font-mono truncate max-w-[120px] text-muted-foreground">{f.referenceNo || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={f.status === "FILED" ? "success" : f.status === "PENDING" ? "default" : "info"}>
                        {f.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {f.status !== "FILED" && (
                        <button
                          onClick={() => handleOpenFilingModal(f)}
                          className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold inline-flex items-center cursor-pointer"
                        >
                          <Check className="w-3 h-3 mr-0.5" /> Submit Return
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Income tax discrepancy notices */}
      <Card className="border border-red-500/20 bg-red-500/[0.01]">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4.5 h-4.5 mr-2" /> Active Income Tax Scrutiny Notices
          </CardTitle>
          <CardDescription>Manage Section 143(1) adjustments and Section 148 reassessment notices.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {itNotices.length === 0 ? (
            <p className="text-xs text-muted-foreground p-6 text-center">No outstanding IT notices mapped to this branch.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Taxpayer Name</TableHead>
                  <TableHead>Notice Section</TableHead>
                  <TableHead>Notice ID</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itNotices.map((n) => (
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

      {/* Form 16 OCR Modal */}
      <Modal isOpen={showOcrModal} onClose={() => setShowOcrModal(false)} size="lg" title="AI OCR Form-16 Document Reader">
        <div className="space-y-4">
          <div className="p-4 border border-dashed border-border/80 rounded-xl bg-muted/20 text-center space-y-3">
            <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <div>
              <span className="text-xs font-bold block text-foreground">Drag and Drop Form 16 PDF</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">File size limit: 10MB</span>
            </div>
            
            <div className="max-w-xs mx-auto">
              <select
                value={selectedClientForOcr}
                onChange={(e) => setSelectedClientForOcr(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">-- Associate with Client --</option>
                {clients
                  .filter((c) => activeBranch === "all" || c.branchId === activeBranch)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleRunOcr}
              disabled={ocrScanning || !selectedClientForOcr}
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg flex items-center justify-center mx-auto cursor-pointer shadow-sm disabled:opacity-50"
            >
              {ocrScanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Scanning Salary Schedules...
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 mr-1.5" /> Execute OCR OCR
                </>
              )}
            </button>
          </div>

          {ocrResult && (
            <div className="border border-border/80 rounded-xl p-4 bg-slate-900/10 space-y-3.5 animate-fade-in text-xs">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="font-extrabold text-primary flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-emerald-500" /> Extracted Salary Data
                </span>
                <Badge variant="default">{ocrResult.suggestedItrType}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-muted-foreground">Employer Name:</span> <span className="font-semibold">{ocrResult.employerName}</span></div>
                <div><span className="text-muted-foreground">Employer TAN:</span> <span className="font-semibold font-mono">{ocrResult.tanOfEmployer}</span></div>
                <div><span className="text-muted-foreground">Gross Salary:</span> <span className="font-bold text-foreground">₹{ocrResult.grossSalary.toLocaleString("en-IN")}</span></div>
                <div><span className="text-muted-foreground">TDS Deducted (Sec 192):</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{ocrResult.taxDeductedAtSource.toLocaleString("en-IN")}</span></div>
              </div>

              <div className="flex justify-end pt-2 border-t border-border/20">
                <button
                  onClick={() => {
                    setShowOcrModal(false);
                    alert("OCR data mapped directly to client ITR workspace!");
                  }}
                  className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-lg cursor-pointer"
                >
                  Map to Return Form
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* File ITR Return Modal */}
      <Modal isOpen={showFilingModal} onClose={() => setShowFilingModal(false)} title="Enter ITR filing Details">
        <form onSubmit={handleMarkAsFiled} className="space-y-4">
          <div className="bg-muted/10 p-3 rounded-lg border border-border/60 mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Taxpayer Entity</span>
            <span className="text-sm font-semibold text-foreground">{selectedFiling?.clientName}</span>
            <span className="text-xs text-muted-foreground block mt-0.5">AY: {selectedFiling?.period} • Due Date: {selectedFiling?.dueDate}</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Acknowledgement Number *</label>
              <input
                type="text"
                required
                value={ackNo}
                onChange={(e) => setAckNo(e.target.value)}
                placeholder="ACK-IT-AY26-XXXX"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Final Tax Payable (₹)</label>
                <input
                  type="number"
                  value={taxPayable}
                  onChange={(e) => setTaxPayable(e.target.value)}
                  placeholder="0"
                  className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Tax Refund Claimed (₹)</label>
                <input
                  type="number"
                  value={refundClaimed}
                  onChange={(e) => setRefundClaimed(e.target.value)}
                  placeholder="12400"
                  className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
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
              Log ITR Return Filed
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
