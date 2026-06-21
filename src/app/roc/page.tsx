"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import {
  Building2,
  Search,
  CheckCircle,
  FileCheck,
  Calendar,
  Filter,
  Check,
  Building,
  UserCheck,
  Briefcase
} from "lucide-react";

export default function ROCPage() {
  const {
    clients,
    filings,
    activeBranch,
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showFilingModal, setShowFilingModal] = useState(false);
  const [selectedFiling, setSelectedFiling] = useState<any | null>(null);
  const [srn, setSrn] = useState("");
  const [govFee, setGovFee] = useState("");

  // Filters ROC filings
  const filteredRocFilings = useMemo(() => {
    return filings.filter((f) => {
      if (f.module !== "ROC") return false;
      const client = clients.find((c) => c.id === f.clientId);
      const matchBranch = activeBranch === "all" || (client && client.branchId === activeBranch);
      
      const matchSearch =
        f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || f.status === statusFilter;

      return matchBranch && matchSearch && matchStatus;
    });
  }, [filings, clients, activeBranch, searchQuery, statusFilter]);

  // Corporate entities list (Pvt Ltd, LLP)
  const corporateClients = useMemo(() => {
    return clients.filter(
      (c) =>
        (c.businessType === "PRIVATE_LIMITED" || c.businessType === "LLP" || c.businessType === "PARTNERSHIP") &&
        (activeBranch === "all" || c.branchId === activeBranch)
    );
  }, [clients, activeBranch]);

  // Mock Director Board Registry
  const directorsList = [
    { id: "dir-1", companyName: "Acme Tech Solutions Private Limited", directorName: "Siddharth Mehta", din: "09128032", status: "Active" },
    { id: "dir-2", companyName: "Acme Tech Solutions Private Limited", directorName: "Rajesh Singhal", din: "08821902", status: "Active" },
    { id: "dir-3", companyName: "Global Export Logistics", directorName: "Sanjay Singhania", din: "07712890", status: "Active" },
  ];

  // Mock Board Meeting intervals
  const boardMeetings = [
    { id: "bm-1", companyName: "Acme Tech Solutions Private Limited", date: "2026-05-15", quarter: "Q1 FY26", attendees: "All directors present", compliance: "COMPLIANT" },
    { id: "bm-2", companyName: "Global Export Logistics", date: "2026-06-12", quarter: "Q1 FY26", attendees: "2 Directors present", compliance: "COMPLIANT" },
  ];

  const handleOpenFilingModal = (filing: any) => {
    setSelectedFiling(filing);
    setSrn("");
    setGovFee("");
    setShowFilingModal(true);
  };

  const handleMarkAsFiled = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiling || !srn) return;

    selectedFiling.status = "FILED";
    selectedFiling.referenceNo = srn;
    selectedFiling.filedDate = new Date().toISOString().split("T")[0];
    selectedFiling.taxPaid = parseFloat(govFee) || null;

    setShowFilingModal(false);
    alert("ROC Return filed successfully! MCA SRN logged.");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-primary" /> ROC & Corporate Compliance Registry
        </h2>
        <p className="text-xs text-muted-foreground">
          Track annual financial statements (AOC-4), annual return filings (MGT-7), log corporate directors, and verify board meeting compliance.
        </p>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROC Annual Returns */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 border-b border-border/40 mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-bold">Annual filings tracking</CardTitle>
                <CardDescription>Track AOC-4 & MGT-7 statutory due dates under the Companies Act 2013.</CardDescription>
              </div>

              {/* Search & filter */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="FILED">Filed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {filteredRocFilings.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No outstanding annual returns mapped.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Financial Year</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>SRN / Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRocFilings.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-semibold text-xs truncate max-w-[150px]">{f.clientName}</TableCell>
                      <TableCell className="text-xs font-semibold">{f.type}</TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{f.period}</TableCell>
                      <TableCell className="text-xs font-semibold">{f.dueDate}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[120px]">{f.referenceNo || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={f.status === "FILED" ? "success" : "default"}>
                          {f.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {f.status !== "FILED" && (
                          <button
                            onClick={() => handleOpenFilingModal(f)}
                            className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold inline-flex items-center cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 mr-0.5" /> Submit SRN
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

        {/* Corporate registries (CIN) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center"><Building className="w-4.5 h-4.5 mr-2 text-primary" /> Corporate CIN registry</CardTitle>
              <CardDescription>Incorporated Private Limiteds and active LLPs details.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {corporateClients.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No incorporated clients mapped.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>CIN Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {corporateClients.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-semibold text-xs truncate max-w-[120px]">{c.name}</TableCell>
                        <TableCell className="text-xs font-mono font-semibold text-primary">
                          {c.pan ? `U${Math.floor(10000 + Math.random() * 90000)}MH2022PTC${Math.floor(100000 + Math.random() * 900000)}` : "LLPIN: AAA-1234"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Directors list and board meetings details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Directors List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center"><UserCheck className="w-4.5 h-4.5 mr-2 text-primary" /> Director & DIN Registry</CardTitle>
            <CardDescription>DIN allocation tracking for company executives.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Director Name</TableHead>
                  <TableHead>Company Associated</TableHead>
                  <TableHead>DIN Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {directorsList.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-semibold text-xs">{d.directorName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">{d.companyName}</TableCell>
                    <TableCell className="text-xs font-mono font-semibold text-primary">{d.din}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Board Meetings Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center"><Briefcase className="w-4.5 h-4.5 mr-2 text-primary" /> Board Meetings (Sect 173)</CardTitle>
            <CardDescription>Verify meetings intervals to prevent late fee escalation.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Meeting Date</TableHead>
                  <TableHead>Compliance Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boardMeetings.map((bm) => (
                  <TableRow key={bm.id}>
                    <TableCell className="font-semibold text-xs">{bm.companyName}</TableCell>
                    <TableCell className="text-xs">{bm.date}</TableCell>
                    <TableCell>
                      <Badge variant="success">{bm.compliance}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

      {/* File Return Modal */}
      <Modal isOpen={showFilingModal} onClose={() => setShowFilingModal(false)} title="Enter MCA filing References">
        <form onSubmit={handleMarkAsFiled} className="space-y-4">
          <div className="bg-muted/10 p-3 rounded-lg border border-border/60 mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Company Entity</span>
            <span className="text-sm font-semibold text-foreground">{selectedFiling?.clientName}</span>
            <span className="text-xs text-muted-foreground block mt-0.5">Return Form: {selectedFiling?.type} • Due Date: {selectedFiling?.dueDate}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">SRN (Service Request Number) *</label>
              <input
                type="text"
                required
                value={srn}
                onChange={(e) => setSrn(e.target.value)}
                placeholder="SRN-A00000000"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Government Filing Fee Paid (₹)</label>
              <input
                type="number"
                value={govFee}
                onChange={(e) => setGovFee(e.target.value)}
                placeholder="2000"
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
              Submit SRN Reference
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
