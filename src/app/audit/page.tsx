"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import {
  FileCheck,
  Search,
  Plus,
  Shield,
  ClipboardList,
  AlertTriangle,
  FolderOpen,
  CheckCircle2,
  FileText,
  UserCheck,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface AuditAssignment {
  id: string;
  clientName: string;
  auditType: "Statutory Audit" | "Tax Audit" | "Internal Audit";
  leadAuditor: string;
  status: "Scoping" | "Fieldwork" | "Draft Report" | "Partner Review" | "Completed";
  progress: number;
  findingsCount: number;
  docsCount: number;
}

interface AuditObservation {
  id: string;
  assignmentId: string;
  clientName: string;
  area: string; // e.g. Fixed Assets, Cash reconciliation
  finding: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  recommendation: string;
}

export default function AuditPage() {
  const { activeBranch } = useDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [obsArea, setObsArea] = useState("");
  const [obsFinding, setObsFinding] = useState("");
  const [obsSeverity, setObsSeverity] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [obsRec, setObsRec] = useState("");
  const [selectedAuditId, setSelectedAuditId] = useState("aud-1");

  // Mock Active Assignments
  const [assignments, setAssignments] = useState<AuditAssignment[]>([
    { id: "aud-1", clientName: "Acme Tech Solutions Private Limited", auditType: "Statutory Audit", leadAuditor: "Ananya Sharma (Manager)", status: "Fieldwork", progress: 45, findingsCount: 3, docsCount: 12 },
    { id: "aud-2", clientName: "Zenith Bangalore Developers LLP", auditType: "Tax Audit", leadAuditor: "Deepak Yadav (Partner)", status: "Partner Review", progress: 85, findingsCount: 1, docsCount: 8 },
    { id: "aud-3", clientName: "Karan Johar & Partners", auditType: "Internal Audit", leadAuditor: "Priya Nair (Accountant)", status: "Draft Report", progress: 70, findingsCount: 4, docsCount: 5 },
  ]);

  // Mock Observations
  const [observations, setObservations] = useState<AuditObservation[]>([
    { id: "obs-1", assignmentId: "aud-1", clientName: "Acme Tech Solutions Private Limited", area: "Fixed Assets", finding: "Physical verification sheet for laptops missing serial tag numbers matching assets registry schedules.", severity: "MEDIUM", recommendation: "Obtain serial logs from IT head and stamp barcode stickers." },
    { id: "obs-2", assignmentId: "aud-3", clientName: "Karan Johar & Partners", area: "Petty Cash Reconciliation", finding: "Cash receipts exceeding Rs 10,000 paid in physical cash violating Section 40A(3) thresholds.", severity: "HIGH", recommendation: "Instruct account managers to disburse vendor invoices via digital bank transfer to ensure deductions eligibility." },
  ]);

  const filteredAudits = useMemo(() => {
    return assignments.filter((a) => {
      const matchSearch =
        a.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.leadAuditor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === "all" || a.auditType === typeFilter;
      return matchSearch && matchType;
    });
  }, [assignments, searchQuery, typeFilter]);

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsArea || !obsFinding) return;

    const audit = assignments.find((a) => a.id === selectedAuditId);
    const newObs: AuditObservation = {
      id: `obs-${Date.now()}`,
      assignmentId: selectedAuditId,
      clientName: audit ? audit.clientName : "Acme Tech",
      area: obsArea,
      finding: obsFinding,
      severity: obsSeverity,
      recommendation: obsRec,
    };

    // Update observations list
    setObservations([newObs, ...observations]);

    // Increment findings count on audit assignment
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAuditId ? { ...a, findingsCount: a.findingsCount + 1 } : a
      )
    );

    // Reset Form
    setObsArea("");
    setObsFinding("");
    setObsRec("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <FileCheck className="w-6 h-6 mr-2 text-primary" /> Audit Workspace & Observations
        </h2>
        <p className="text-xs text-muted-foreground">
          Track statutory, tax and internal audit progress, document audit evidence schedules, and draft scrutiny logs.
        </p>
      </div>

      {/* Main Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Statutory Audits</span>
            <h3 className="text-2xl font-bold mt-1">1 Active</h3>
          </div>
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Tax Audits (Sec 44AB)</span>
            <h3 className="text-2xl font-bold mt-1">1 Active</h3>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Compliance findings logged</span>
            <h3 className="text-2xl font-bold text-red-500 mt-1">{observations.length} Observations</h3>
          </div>
          <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Active Audits Table */}
      <Card>
        <CardHeader className="pb-2 border-b border-border/40 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold">Active assignments</CardTitle>
              <CardDescription>Track project schedules and review deadlines.</CardDescription>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search audit lead..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-2.5 py-1 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Statutory Audit">Statutory</option>
                <option value="Tax Audit">Tax Audit</option>
                <option value="Internal Audit">Internal</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Audit Type</TableHead>
                <TableHead>Lead Auditor</TableHead>
                <TableHead>Work Stage</TableHead>
                <TableHead>Completion Progress</TableHead>
                <TableHead>Observations</TableHead>
                <TableHead>Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-semibold text-xs">{a.clientName}</TableCell>
                  <TableCell className="text-xs font-semibold">{a.auditType}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.leadAuditor}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === "Completed" ? "success" : a.status === "Partner Review" ? "destructive" : "info"}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${a.progress}%` }}></div>
                      </div>
                      <span className="font-bold">{a.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-red-500 font-bold">{a.findingsCount} findings</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.docsCount} schedules</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Observations list */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-foreground flex items-center">
            <AlertTriangle className="w-4.5 h-4.5 text-red-500 mr-2" /> Audit Findings & Discrepancies Register
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Log Observation
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {observations.map((obs) => (
            <Card key={obs.id} className="border border-border/80 p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-foreground">{obs.area}</span>
                    <Badge variant={obs.severity === "HIGH" ? "destructive" : obs.severity === "MEDIUM" ? "warning" : "secondary"}>
                      {obs.severity} RISK
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground block font-medium">{obs.clientName}</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-red-500/[0.02] border border-red-500/10 rounded-lg">
                  <span className="font-semibold text-red-600 dark:text-red-400 block mb-1">Auditor Observation / Finding</span>
                  <p className="text-muted-foreground leading-relaxed">{obs.finding}</p>
                </div>
                <div className="p-3 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Tax Mitigations / Recommendation</span>
                  <p className="text-muted-foreground leading-relaxed">{obs.recommendation}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Log Observation Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Log Audit Observation">
        <form onSubmit={handleAddObservation} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Audit Assignment</label>
            <select
              value={selectedAuditId}
              onChange={(e) => setSelectedAuditId(e.target.value)}
              className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.clientName} - {a.auditType}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Observation Area</label>
              <input
                type="text"
                required
                value={obsArea}
                onChange={(e) => setObsArea(e.target.value)}
                placeholder="Fixed Assets Depreciation"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Risk Severity</label>
              <select
                value={obsSeverity}
                onChange={(e) => setObsSeverity(e.target.value as any)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk (Sec Violations)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Description of Finding / Discrepancy</label>
            <textarea
              rows={3}
              required
              value={obsFinding}
              onChange={(e) => setObsFinding(e.target.value)}
              placeholder="Provide a detailed audit finding. E.g., mismatch in depreciation calculations under IT Act Section 32 vs Companies Act Schedule II."
              className="w-full text-xs p-2.5 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Auditor Recommendation</label>
            <textarea
              rows={3}
              required
              value={obsRec}
              onChange={(e) => setObsRec(e.target.value)}
              placeholder="Recommended correction action to prevent qualifications in audit report."
              className="w-full text-xs p-2.5 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 border border-border/60 text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg flex items-center cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Log Finding
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
