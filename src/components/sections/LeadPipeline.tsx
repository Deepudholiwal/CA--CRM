"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { useDatabase } from "../../context/DatabaseContext";
import {
  KanbanSquare,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck,
  PhoneCall,
  Mail,
  RefreshCw,
  Clock,
  Sparkles,
  Download
} from "lucide-react";

export default function LeadPipeline() {
  const { 
    leads, 
    addLead, 
    updateLeadStage, 
    updateLead, 
    addLeadComment, 
    activeBranch, 
    activeRole 
  } = useDatabase();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedLeadForProposal, setSelectedLeadForProposal] = useState<any | null>(null);

  // New Lead Form State
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("Website");
  const [value, setValue] = useState("45000");
  const [notes, setNotes] = useState("");

  // Proposal Builder State
  const [feeGst, setFeeGst] = useState("15000");
  const [feeItr, setFeeItr] = useState("10000");
  const [feeAudit, setFeeAudit] = useState("35000");
  const [proposalDetails, setProposalDetails] = useState<any | null>(null);

  // Edit Lead & Comments State
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editBranchId, setEditBranchId] = useState("");

  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    setIsEditing(false);
    setNewComment("");
    
    setEditName(lead.name);
    setEditCompany(lead.companyName || "");
    setEditMobile(lead.mobile);
    setEditEmail(lead.email || "");
    setEditSource(lead.source);
    setEditValue(lead.estimatedValue.toString());
    setEditNotes(lead.notes || "");
    setEditBranchId(lead.branchId);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    const updatedFields = {
      name: editName,
      companyName: editCompany,
      mobile: editMobile,
      email: editEmail,
      source: editSource,
      estimatedValue: parseFloat(editValue) || 0,
      notes: editNotes,
      branchId: editBranchId,
    };

    updateLead(selectedLead.id, updatedFields);
    setSelectedLead({
      ...selectedLead,
      ...updatedFields
    });
    setIsEditing(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newComment.trim()) return;

    let employeeName = "Deepak Yadav (Partner)";
    if (activeRole === "Manager") employeeName = "Ananya Sharma (Manager)";
    else if (activeRole === "Tax Consultant") employeeName = "Amit Patel (Tax Consultant)";
    else if (activeRole === "Accountant") employeeName = "Priya Nair (Accountant)";
    else if (activeRole === "Client") employeeName = "Siddharth Mehta (Client)";

    addLeadComment(selectedLead.id, newComment, employeeName);

    const updatedComments = [
      ...(selectedLead.comments || []),
      {
        id: `lc-temp-${Date.now()}`,
        employeeName,
        comment: newComment,
        createdAt: "Just now"
      }
    ];
    setSelectedLead({
      ...selectedLead,
      comments: updatedComments
    });
    setNewComment("");
  };

  // Filter leads based on active branch selection
  const filteredLeads = leads.filter(
    (l) => activeBranch === "all" || l.branchId === activeBranch
  );

  const stages = [
    { key: "NEW", title: "New Inquiries", color: "border-sky-500/30" },
    { key: "PROPOSAL_SENT", title: "Proposals Sent", color: "border-purple-500/30" },
    { key: "NEGOTIATION", title: "Negotiation", color: "border-amber-500/30" },
    { key: "WON", title: "Closed Won (Converted)", color: "border-emerald-500/30" },
    { key: "LOST", title: "Closed Lost", color: "border-rose-500/30" },
  ];

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;
    addLead({
      name,
      companyName: company || "",
      mobile,
      email,
      source,
      stage: "NEW",
      estimatedValue: parseFloat(value) || 0,
      notes,
      branchId: activeBranch === "all" ? "br-delhi" : activeBranch,
    });

    // Reset Form
    setName("");
    setCompany("");
    setMobile("");
    setEmail("");
    setNotes("");
    setShowAddModal(false);
  };

  const handleGenerateProposal = (lead: any) => {
    setSelectedLeadForProposal(lead);
    setShowProposalModal(true);
  };

  const submitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForProposal) return;
    
    const gstVal = parseFloat(feeGst) || 0;
    const itrVal = parseFloat(feeItr) || 0;
    const auditVal = parseFloat(feeAudit) || 0;
    const total = gstVal + itrVal + auditVal;

    setProposalDetails({
      id: `PROP-${Math.floor(1000 + Math.random() * 9000)}`,
      to: selectedLeadForProposal.name,
      company: selectedLeadForProposal.companyName || "N/A",
      gstFee: gstVal,
      itrFee: itrVal,
      auditFee: auditVal,
      total,
      date: new Date().toLocaleDateString("en-IN"),
    });

    // Move lead stage to PROPOSAL_SENT
    updateLeadStage(selectedLeadForProposal.id, "PROPOSAL_SENT");
  };

  // Metrics
  const totalValue = filteredLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const wonCount = filteredLeads.filter((l) => l.stage === "WON").length;
  const totalClosed = filteredLeads.filter((l) => l.stage === "WON" || l.stage === "LOST").length;
  const conversionRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Pipeline Value</span>
            <h3 className="text-2xl font-bold text-foreground mt-1">₹{totalValue.toLocaleString("en-IN")}</h3>
          </div>
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Active Inquiries</span>
            <h3 className="text-2xl font-bold text-foreground mt-1">{filteredLeads.filter(l => l.stage !== "WON" && l.stage !== "LOST").length}</h3>
          </div>
          <div className="w-10 h-10 bg-sky-500/10 text-sky-500 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Win Conversion Rate</span>
            <h3 className="text-2xl font-bold text-foreground mt-1">{conversionRate}%</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Header and Controls */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-base text-foreground flex items-center">
          <KanbanSquare className="w-5 h-5 text-primary mr-2" /> Lead Pipeline Board
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Inquiry / Lead
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage.key);
          return (
            <div key={stage.key} className="flex-1 min-w-[240px] bg-muted/20 border border-border/40 rounded-xl p-3 flex flex-col h-[520px]">
              
              {/* Stage Header */}
              <div className="flex justify-between items-center border-b border-border/40 pb-2 mb-3">
                <span className="text-xs font-bold text-foreground">{stage.title}</span>
                <Badge variant={stage.key === "WON" ? "success" : stage.key === "LOST" ? "destructive" : "default"}>
                  {stageLeads.length}
                </Badge>
              </div>

              {/* Lead Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stageLeads.length === 0 ? (
                  <div className="h-full border border-dashed border-border/40 rounded-xl flex items-center justify-center text-[10px] text-muted-foreground p-3 text-center">
                    No leads at this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => handleSelectLead(lead)}
                      className="bg-card border border-border/80 rounded-lg p-3.5 space-y-3.5 shadow-sm hover:border-primary/20 hover:shadow transition-all group cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[140px]">
                            {lead.name}
                          </h4>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 scale-90">
                            {lead.source}
                          </Badge>
                        </div>
                        {lead.companyName && (
                          <span className="text-[10px] text-muted-foreground block font-medium truncate mt-0.5">
                            {lead.companyName}
                          </span>
                        )}
                      </div>

                      {/* Details row */}
                      <div className="flex flex-col space-y-1 border-t border-border/30 pt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center"><PhoneCall className="w-3 h-3 mr-1.5 flex-shrink-0 text-slate-400" /> {lead.mobile}</span>
                        {lead.email && <span className="flex items-center"><Mail className="w-3 h-3 mr-1.5 flex-shrink-0 text-slate-400" /> {lead.email}</span>}
                      </div>

                      {/* Est Value and Actions */}
                      <div className="flex justify-between items-center border-t border-border/30 pt-2">
                        <span className="text-xs font-bold text-foreground">
                          ₹{lead.estimatedValue.toLocaleString("en-IN")}
                        </span>
                        
                        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          {lead.stage === "NEW" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateProposal(lead);
                              }}
                              className="text-[9px] font-bold text-primary border border-primary/20 hover:bg-primary/5 px-2 py-1 rounded transition-all cursor-pointer"
                              title="Build Proposal & Quote"
                            >
                              Proposal
                            </button>
                          )}
                          {lead.stage !== "WON" && lead.stage !== "LOST" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateLeadStage(lead.id, lead.stage === "PROPOSAL_SENT" ? "NEGOTIATION" : "WON");
                              }}
                              className="text-[9px] font-bold bg-primary hover:bg-primary/95 text-white px-2 py-1 rounded transition-all flex items-center cursor-pointer"
                              title="Progress stage"
                            >
                              Move <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Lead / Inquiry">
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Contact Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Raman Sood"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Sood Logistics LLP"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9812903120"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Email ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="accounts@soodlogistics.com"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="Website">Website Form</option>
                <option value="Referral">Client Referral</option>
                <option value="Cold Call">Cold Outreach</option>
                <option value="WhatsApp">WhatsApp Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Est Package Value (₹) *</label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">Inquiry / Note Summary</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Requires full scope bookkeeping audit and income tax advisory for a partnership logistics firm."
              className="w-full text-xs p-2.5 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 border border-border/60 text-muted-foreground hover:bg-muted text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm"
            >
              Create Lead
            </button>
          </div>
        </form>
      </Modal>

      {/* Proposal Generator Modal */}
      <Modal
        isOpen={showProposalModal}
        onClose={() => {
          setShowProposalModal(false);
          setProposalDetails(null);
        }}
        title="Fee Proposal & Quotation Generator"
      >
        {!proposalDetails ? (
          <form onSubmit={submitProposal} className="space-y-4">
            <div className="bg-muted/10 p-3 rounded-lg border border-border/60 mb-2">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">Quotation For</span>
              <span className="text-sm font-semibold text-foreground">{selectedLeadForProposal?.name}</span>
              {selectedLeadForProposal?.companyName && (
                <span className="text-xs text-muted-foreground block font-medium mt-0.5">
                  ({selectedLeadForProposal.companyName})
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Monthly GST Filing Fee (₹)</label>
                <input
                  type="number"
                  value={feeGst}
                  onChange={(e) => setFeeGst(e.target.value)}
                  className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Annual ITR Return Filing Fee (₹)</label>
                <input
                  type="number"
                  value={feeItr}
                  onChange={(e) => setFeeItr(e.target.value)}
                  className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Statutory / Internal Audit Fee (₹)</label>
                <input
                  type="number"
                  value={feeAudit}
                  onChange={(e) => setFeeAudit(e.target.value)}
                  className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setShowProposalModal(false)}
                className="px-3 py-1.5 border border-border/60 text-muted-foreground hover:bg-muted text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg flex items-center cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Compile Quotation
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="border border-border/80 rounded-xl p-6 bg-slate-900/10 relative overflow-hidden font-sans">
              
              {/* Watermark logo */}
              <div className="absolute right-4 top-4 text-xs font-bold text-slate-700 bg-slate-800/10 px-2 py-1 rounded">
                PROPOSAL ID: {proposalDetails.id}
              </div>

              <div className="text-center border-b border-border/60 pb-4 mb-4">
                <h4 className="font-extrabold text-sm text-foreground uppercase tracking-wider">FEE PROPOSAL & ENGAGEMENT LETTER</h4>
                <p className="text-[9px] text-muted-foreground mt-0.5">Date of Issuance: {proposalDetails.date}</p>
              </div>

              <div className="text-xs text-foreground/80 space-y-1">
                <div><span className="font-semibold text-muted-foreground">Prepared For:</span> {proposalDetails.to}</div>
                <div><span className="font-semibold text-muted-foreground">Company Name:</span> {proposalDetails.company}</div>
              </div>

              {/* Items Table */}
              <div className="mt-4 border border-border/40 rounded-lg overflow-hidden text-[10px]">
                <div className="bg-muted/40 grid grid-cols-2 p-2 font-semibold text-muted-foreground border-b border-border/40">
                  <span>Scope of Work description</span>
                  <span className="text-right">Proposed Fees (Annual retainer)</span>
                </div>
                <div className="divide-y divide-border/20">
                  <div className="grid grid-cols-2 p-2 text-foreground/90">
                    <span>GST Registration, Filing GSTR-1 & GSTR-3B Reconciliations</span>
                    <span className="text-right font-semibold">₹{proposalDetails.gstFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 text-foreground/90">
                    <span>ITR-5/6 Annual Corporate Income Tax Filing & Planning</span>
                    <span className="text-right font-semibold">₹{proposalDetails.itrFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 text-foreground/90">
                    <span>Statutory Audit Workspace schedules, Site Verification</span>
                    <span className="text-right font-semibold">₹{proposalDetails.auditFee.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="bg-muted/30 grid grid-cols-2 p-2.5 font-bold text-foreground border-t border-border/40">
                  <span>Total Professional Fee Quote</span>
                  <span className="text-right text-primary font-bold">₹{proposalDetails.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="mt-4 text-[9px] text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                * Note: Out-of-pocket expenses and government filing fee disbursements will be charged extra. The above quotation remains valid for 30 days from date of issuance.
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-border/40 pt-4 mt-6">
              <span className="text-[10px] text-emerald-500 font-bold flex items-center">
                ✔ Proposal dispatched to client WhatsApp logs!
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProposalModal(false);
                    setProposalDetails(null);
                  }}
                  className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg flex items-center cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Download PDF Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Lead Details & Comments Modal */}
      <Modal
        isOpen={selectedLead !== null}
        onClose={() => {
          setSelectedLead(null);
          setIsEditing(false);
        }}
        title={isEditing ? "Edit Lead Details" : "Lead Details & Comments"}
      >
        {selectedLead && (
          <div className="space-y-4">
            {isEditing ? (
              <form onSubmit={handleSaveLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Company Name</label>
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Email ID</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Lead Source</label>
                    <select
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="Website">Website Form</option>
                      <option value="Referral">Client Referral</option>
                      <option value="Cold Call">Cold Outreach</option>
                      <option value="WhatsApp">WhatsApp Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Est Value (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Inquiry / Note Summary</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 border border-border/60 text-muted-foreground hover:bg-muted text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-muted/10 border border-border/40 p-4 rounded-xl">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Contact Name</span>
                    <span className="text-xs font-semibold text-foreground">{selectedLead.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Company Name</span>
                    <span className="text-xs font-semibold text-foreground">{selectedLead.companyName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Mobile Number</span>
                    <span className="text-xs font-semibold text-foreground">{selectedLead.mobile}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Email Address</span>
                    <span className="text-xs font-semibold text-foreground truncate block">{selectedLead.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Lead Source</span>
                    <span className="text-xs font-semibold text-foreground">{selectedLead.source}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Estimated Value</span>
                    <span className="text-xs font-bold text-primary">₹{selectedLead.estimatedValue.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Created Date</span>
                    <span className="text-xs font-semibold text-foreground">{selectedLead.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Pipeline Stage</span>
                    <Badge variant={selectedLead.stage === "WON" ? "success" : selectedLead.stage === "LOST" ? "destructive" : "default"} className="scale-90 origin-left">
                      {selectedLead.stage}
                    </Badge>
                  </div>
                </div>

                {/* Notes Summary */}
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Inquiry / Note Summary</span>
                  <div className="bg-muted/10 border border-border/40 p-3 rounded-lg text-xs text-muted-foreground leading-relaxed">
                    {selectedLead.notes || "No additional notes provided."}
                  </div>
                </div>

                <div className="border-t border-border/40 pt-4">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-2">Follow-up Comments ({selectedLead.comments?.length || 0})</span>
                  
                  {/* Comments list */}
                  <div className="space-y-3 max-h-48 overflow-y-auto mb-4 border border-border/40 rounded-xl p-3 bg-muted/10">
                    {!selectedLead.comments || selectedLead.comments.length === 0 ? (
                      <p className="text-[10px] text-muted-foreground text-center py-4">No comments on this lead yet.</p>
                    ) : (
                      selectedLead.comments.map((c: any) => (
                        <div key={c.id} className="text-[11px] border-b border-border/20 last:border-0 pb-2 mb-2 last:mb-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-foreground">{c.employeeName}</span>
                            <span className="text-[9px] text-muted-foreground">{c.createdAt}</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{c.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Add follow-up notes or update comment log..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary animate-fade-in"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer shadow-sm"
                    >
                      Post
                    </button>
                  </form>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t border-border/40 pt-4 mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 border border-border/60 text-foreground hover:bg-muted text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
