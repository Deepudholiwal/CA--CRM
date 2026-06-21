"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import {
  ExternalLink,
  Upload,
  Calendar,
  FileCheck,
  FolderOpen,
  CreditCard,
  MessageSquare,
  TrendingUp,
  Download,
  AlertTriangle,
  LogOut,
  User,
  Check,
  Send
} from "lucide-react";
import Link from "next/link";

export default function ClientPortal() {
  const {
    clients,
    filings,
    invoices,
    documents,
    payments,
    whatsappLogs,
    addDocument,
    payInvoice,
    sendWhatsAppNotification
  } = useDatabase();

  const [activeTab, setActiveTab] = useState<"compliance" | "docs" | "billing" | "chat">("compliance");
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Payment inputs
  const [payMode, setPayMode] = useState("UPI");
  const [refCode, setRefCode] = useState("");

  // Upload inputs
  const [filename, setFilename] = useState("");
  const [cat, setCat] = useState("PAN");
  const [selectedFile, setSelectedFile] = useState<string>("");

  // Client Chat simulation
  const [chatInput, setChatInput] = useState("");

  // Identify portal client (simulate Acme Tech Solutions)
  const portalClient = clients.find((c) => c.id === "cli-1") || clients[0];

  // Specific client data
  const myFilings = useMemo(() => filings.filter((f) => f.clientId === portalClient?.id), [filings, portalClient]);
  const myDocs = useMemo(() => documents.filter((d) => d.clientId === portalClient?.id), [documents, portalClient]);
  const myInvoices = useMemo(() => invoices.filter((i) => i.clientId === portalClient?.id), [invoices, portalClient]);
  const myWaLogs = useMemo(() => whatsappLogs.filter((w) => w.clientId === portalClient?.id), [whatsappLogs, portalClient]);

  const outstandingBal = useMemo(() => {
    return myInvoices
      .filter((i) => i.status === "UNPAID" || i.status === "PARTIALLY_PAID")
      .reduce((sum, curr) => {
        const paid = payments
          .filter((p) => p.invoiceId === curr.id)
          .reduce((s, p) => s + p.amount, 0);
        return sum + (curr.total - paid);
      }, 0);
  }, [myInvoices, payments]);

  const handlePayCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !refCode) return;

    payInvoice(selectedInvoice.id, payMode, refCode, selectedInvoice.total);
    setShowPayModal(false);
    alert("Payment checkout completed! Invoice receipt updated.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      setFilename(file.name.replace(/\.[^/.]+$/, "")); // Auto fill name without extension
    }
  };

  const handlePortalUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename || !portalClient) return;

    addDocument({
      clientId: portalClient.id,
      clientName: portalClient.name,
      name: filename.endsWith(".pdf") ? filename : `${filename}.pdf`,
      fileUrl: `https://s3.aws.amazon.com/cafirm/cli-${portalClient.id}/${filename}.pdf`,
      fileSize: "1.2 MB",
      fileType: "pdf",
      category: cat,
    });

    setFilename("");
    setSelectedFile("");
    alert("KYC document uploaded successfully to S3 storage bucket!");
  };

  const handleSendPortalChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !portalClient) return;

    sendWhatsAppNotification(portalClient.id, `[Client Portal Message]: ${chatInput}`);
    setChatInput("");
    alert("Message disaptched to your accountant's logs!");
  };

  return (
    <div className="min-h-screen bg-[#090D1A] text-slate-100 font-sans flex flex-col justify-between">
      
      {/* Top Banner Header */}
      <header className="h-16 border-b border-white/5 bg-slate-900/60 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-extrabold">
            P
          </div>
          <div>
            <span className="font-bold text-xs block text-foreground leading-none">Taxpayer Client Portal</span>
            <span className="text-[9px] text-muted-foreground block font-medium mt-0.5">{portalClient?.name}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="success" className="scale-95">{portalClient?.clientId}</Badge>
          <Link
            href="/login"
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded bg-white/5 border border-white/5 text-[10px] font-bold flex items-center cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> Logout Portal
          </Link>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block">Logged In Taxpayer</span>
            <h2 className="text-xl font-bold text-white leading-tight">{portalClient?.name}</h2>
            <p className="text-xs text-slate-400 leading-normal">
              Corporate Office: {portalClient?.address}, {portalClient?.city} • GSTIN: {portalClient?.gstin}
            </p>
          </div>

          <div className="flex items-center space-x-6 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 text-xs">
            <div>
              <span className="text-slate-400 block">Compliance Status</span>
              <Badge variant="success" className="mt-1">COMPLIANT</Badge>
            </div>
            <div>
              <span className="text-slate-400 block">Outstanding Retainer</span>
              <span className="text-lg font-bold text-red-500 block mt-0.5">₹{outstandingBal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/5 pb-1">
          <button
            onClick={() => setActiveTab("compliance")}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "compliance" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Filing Statuses</span>
          </button>
          <button
            onClick={() => setActiveTab("docs")}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "docs" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center"><FolderOpen className="w-4 h-4 mr-1.5" /> My Documents</span>
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "billing" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center"><CreditCard className="w-4 h-4 mr-1.5" /> Invoices & Pay</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "chat" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" /> Message Advisor</span>
          </button>
        </div>

        {/* TAB 1: COMPLIANCE STATUSES */}
        {activeTab === "compliance" && (
          <Card className="bg-slate-900/30 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center text-white"><FileCheck className="w-4.5 h-4.5 mr-2 text-emerald-400" /> Compliance Filing Register</CardTitle>
              <CardDescription className="text-slate-400">Track GSTR, TDS, and ITR schedules filed on your behalf.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table className="text-slate-200">
                <TableHeader className="bg-slate-800/30">
                  <TableRow>
                    <TableHead className="text-slate-400">Tax Type</TableHead>
                    <TableHead className="text-slate-400">Period</TableHead>
                    <TableHead className="text-slate-400">Filing Due Date</TableHead>
                    <TableHead className="text-slate-400">Filing Date</TableHead>
                    <TableHead className="text-slate-400">Acknowledgement ARN</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-white/5 bg-transparent">
                  {myFilings.map((f) => (
                    <TableRow key={f.id} className="hover:bg-white/5">
                      <TableCell className="font-semibold text-xs text-emerald-400">{f.type}</TableCell>
                      <TableCell className="text-xs">{f.period}</TableCell>
                      <TableCell className="text-xs font-semibold">{f.dueDate}</TableCell>
                      <TableCell className="text-xs text-slate-400">{f.filedDate || "--"}</TableCell>
                      <TableCell className="text-xs font-mono text-slate-400">{f.referenceNo || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={f.status === "FILED" ? "success" : "default"}>
                          {f.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: MY DOCUMENTS VAULT */}
        {activeTab === "docs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Files list */}
            <Card className="lg:col-span-2 bg-slate-900/30 border-white/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center text-white"><FolderOpen className="w-4.5 h-4.5 mr-2 text-emerald-400" /> Share File Vault</CardTitle>
                <CardDescription className="text-slate-400">Encrypted storage folders. Click to view version history.</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <Table className="text-slate-200">
                  <TableHeader className="bg-slate-800/30">
                    <TableRow>
                      <TableHead className="text-slate-400">Filename</TableHead>
                      <TableHead className="text-slate-400">Folder Category</TableHead>
                      <TableHead className="text-slate-400">File Size</TableHead>
                      <TableHead className="text-slate-400 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-white/5 bg-transparent">
                    {myDocs.map((d) => (
                      <TableRow key={d.id} className="hover:bg-white/5">
                        <TableCell className="font-semibold text-xs text-emerald-400">{d.name}</TableCell>
                        <TableCell className="text-xs font-semibold">{d.category}</TableCell>
                        <TableCell className="text-xs text-slate-400">{d.fileSize}</TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => alert("File download request successfully initiated!")}
                            className="p-1 rounded bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Download document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Portal File Upload */}
            <Card className="bg-slate-900/30 border-white/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center text-white"><Upload className="w-4.5 h-4.5 mr-2 text-emerald-400" /> Upload bank statements / KYC</CardTitle>
                <CardDescription className="text-slate-400">Add documents to your secure firm directory.</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <form onSubmit={handlePortalUpload} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Folder</label>
                    <select
                      value={cat}
                      onChange={(e) => setCat(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none cursor-pointer"
                    >
                      <option value="PAN">PAN Cards</option>
                      <option value="AADHAAR">Aadhaar Cards</option>
                      <option value="GST_CERT">GST Certificates</option>
                      <option value="BANK_STMT">Bank Statements</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select File *</label>
                    <div className="border border-dashed border-slate-800 rounded-lg p-4 text-center hover:bg-white/5 cursor-pointer relative bg-slate-950">
                      <input
                        type="file"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                      <span className="text-[10px] text-slate-400 block font-semibold truncate">
                        {selectedFile ? `Selected: ${selectedFile}` : "Click to browse local files"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filename *</label>
                    <input
                      type="text"
                      required
                      placeholder="CurrentMonth_Statement"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg flex items-center justify-center cursor-pointer shadow-sm"
                  >
                    Upload File
                  </button>
                </form>
              </CardContent>
            </Card>

          </div>
        )}

        {/* TAB 3: INVOICES & PAYMENTS */}
        {activeTab === "billing" && (
          <Card className="bg-slate-900/30 border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center text-white"><CreditCard className="w-4.5 h-4.5 mr-2 text-emerald-400" /> Invoices & payments logs</CardTitle>
              <CardDescription className="text-slate-400">Settle outstanding CA professional fee retainers.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table className="text-slate-200">
                <TableHeader className="bg-slate-800/30">
                  <TableRow>
                    <TableHead className="text-slate-400">Invoice No</TableHead>
                    <TableHead className="text-slate-400">Due Date</TableHead>
                    <TableHead className="text-slate-400">SubTotal</TableHead>
                    <TableHead className="text-slate-400">SGST/CGST (18%)</TableHead>
                    <TableHead className="text-slate-400">Total sum</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-white/5 bg-transparent">
                  {myInvoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-white/5">
                      <TableCell className="font-mono text-xs font-semibold text-emerald-400">{inv.invoiceNo}</TableCell>
                      <TableCell className="text-xs">{inv.dueDate}</TableCell>
                      <TableCell className="text-xs">₹{inv.subTotal.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-xs text-slate-400">₹{(inv.cgst + inv.sgst + inv.igst).toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-xs font-bold text-white">₹{inv.total.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Badge variant={inv.status === "PAID" ? "success" : "destructive"}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {inv.status !== "PAID" ? (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setRefCode("");
                              setShowPayModal(true);
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold inline-flex items-center cursor-pointer shadow-sm"
                          >
                            Pay now
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-500 font-bold">Paid</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: CHAT WITH ADVISOR */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Chat timeline */}
            <Card className="lg:col-span-2 bg-slate-900/30 border-white/5 h-[400px] flex flex-col justify-between">
              <CardHeader className="border-b border-white/5 py-3">
                <CardTitle className="text-xs font-bold text-white flex items-center"><MessageSquare className="w-4 h-4 mr-1.5 text-emerald-400" /> Communications timeline logs</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4 space-y-3.5">
                {myWaLogs.map((log) => (
                  <div key={log.id} className={`flex ${log.direction === "INCOMING" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl p-3 text-xs leading-normal border border-white/5 ${log.direction === "INCOMING" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-200"}`}>
                      <span className="text-[8px] opacity-75 font-semibold block mb-0.5">{log.timestamp}</span>
                      <p>{log.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t border-white/5 py-2.5 flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask your advisor about tax returns, upload schedules..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendPortalChat(e); }}
                  className="flex-grow text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                />
                <button
                  onClick={handleSendPortalChat}
                  className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </CardFooter>
            </Card>

            {/* Side panel: advisor info */}
            <Card className="bg-slate-900/30 border-white/5 text-xs text-slate-300">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white flex items-center"><User className="w-4.5 h-4.5 mr-2 text-emerald-400" /> Mapped Account Executive</CardTitle>
                <CardDescription className="text-slate-400">Assigned firm consultants details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="space-y-1">
                  <span className="font-semibold text-white block">Amit Patel</span>
                  <span className="text-[10px] text-slate-400 font-medium">Taxation Specialist • Delhi Branch</span>
                </div>
                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <div><span className="text-slate-400">Mobile:</span> +91 98765 43212</div>
                  <div><span className="text-slate-400">Office Email:</span> amit@cafirm.com</div>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

      </main>

      {/* Pay Invoice Checkout Modal */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Checkout UPI payment gateway">
        <form onSubmit={handlePayCheckout} className="space-y-4 text-xs text-foreground/80 font-sans">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-semibold">
            Scan UPI QR Code to pay professional retainer. Total payable: ₹{selectedInvoice?.total.toLocaleString("en-IN")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Select payment Option</label>
              <select
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="UPI">UPI Net-banking (GPay/PhonePe)</option>
                <option value="BANK_TRANSFER">Bank IMPS/NEFT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Reference Transaction Code *</label>
              <input
                type="text"
                required
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                placeholder="UPI998120391"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setShowPayModal(false)}
              className="px-3 py-1.5 border border-border/60 text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm"
            >
              Verify payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-[10px] text-slate-500">
        <p>© 2026 AethelGard Portal Inc. Secure banking connection powered by Razorpay.</p>
      </footer>

    </div>
  );
}
