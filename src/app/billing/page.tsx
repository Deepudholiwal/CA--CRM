"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import {
  CreditCard,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Check,
  Download,
  AlertTriangle,
  Receipt,
  Coins
} from "lucide-react";

export default function BillingPage() {
  const {
    clients,
    invoices,
    payments,
    activeBranch,
    addInvoice,
    payInvoice,
    checkPermission
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // New Invoice Form State
  const [clientId, setClientId] = useState("");
  const [subTotal, setSubTotal] = useState("25000");
  const [cgst, setCgst] = useState("2250");
  const [sgst, setSgst] = useState("2250");
  const [igst, setIgst] = useState("0");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  // Record Payment Form State
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [referenceNo, setReferenceNo] = useState("");
  const [paymentAmt, setPaymentAmt] = useState("");

  // Filters Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const matchBranch = activeBranch === "all" || i.branchId === activeBranch;
      const matchSearch =
        i.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || i.status === statusFilter;

      return matchBranch && matchSearch && matchStatus;
    });
  }, [invoices, activeBranch, searchQuery, statusFilter]);

  // Statistics
  const totalInvoicedValue = filteredInvoices.reduce((sum, curr) => sum + curr.total, 0);
  const collectedValue = filteredInvoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, curr) => sum + curr.total, 0);
  const outstandingValue = filteredInvoices
    .filter((i) => i.status === "UNPAID" || i.status === "PARTIALLY_PAID")
    .reduce((sum, curr) => {
      const paid = payments
        .filter((p) => p.invoiceId === curr.id)
        .reduce((s, p) => s + p.amount, 0);
      return sum + (curr.total - paid);
    }, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !dueDate) return;

    const clientObj = clients.find((c) => c.id === clientId);
    const subTotalVal = parseFloat(subTotal) || 0;
    const cgstVal = parseFloat(cgst) || 0;
    const sgstVal = parseFloat(sgst) || 0;
    const igstVal = parseFloat(igst) || 0;
    const total = subTotalVal + cgstVal + sgstVal + igstVal;

    addInvoice({
      clientId,
      clientName: clientObj ? clientObj.name : "Unknown",
      branchId: clientObj ? clientObj.branchId : "br-delhi",
      dueDate,
      subTotal: subTotalVal,
      cgst: cgstVal,
      sgst: sgstVal,
      igst: igstVal,
      total,
      status: "UNPAID",
      notes,
    });

    // Reset Form
    setClientId("");
    setDueDate("");
    setNotes("");
    setShowAddModal(false);
  };

  const handleOpenPaymentModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    
    // Calculate remaining amount to pay
    const paidAmt = payments
      .filter((p) => p.invoiceId === invoice.id)
      .reduce((s, curr) => s + curr.amount, 0);
    const balance = invoice.total - paidAmt;

    setPaymentAmt(String(balance));
    setReferenceNo("");
    setShowPaymentModal(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !referenceNo || !paymentAmt) return;

    payInvoice(
      selectedInvoice.id,
      paymentMode,
      referenceNo,
      parseFloat(paymentAmt) || 0
    );

    setShowPaymentModal(false);
    alert("Payment logged successfully! Receipt reference added.");
  };

  const triggerDownloadInvoice = (invNo: string) => {
    alert(`Compiling GST itemized invoice format for receipt ${invNo}. PDF dispatch complete!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-primary" /> Billing, Invoices & Collections
        </h2>
        <p className="text-xs text-muted-foreground">
          Generate corporate GST compliance invoices, reconcile outstanding fee balances, and log UPI receipts.
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Invoiced</span>
            <h3 className="text-2xl font-bold text-foreground mt-1">₹{totalInvoicedValue.toLocaleString("en-IN")}</h3>
          </div>
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Collections Received</span>
            <h3 className="text-2xl font-bold text-emerald-500 mt-1">₹{collectedValue.toLocaleString("en-IN")}</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </Card>
        <Card hoverEffect className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Outstanding Balance</span>
            <h3 className="text-2xl font-bold text-red-500 mt-1">₹{outstandingValue.toLocaleString("en-IN")}</h3>
          </div>
          <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Invoices Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Invoices List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 p-4 rounded-xl shadow-sm">
            <div className="flex flex-1 items-center space-x-2 max-w-sm">
              <div className="relative w-full">
                <Search className="absolute inset-y-0 left-0 pl-3 flex items-center w-4 h-4 my-auto text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search invoice number or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Invoices</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
              </select>

              {checkPermission("billing:invoice") && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center cursor-pointer shadow-sm ml-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> New Invoice
                </button>
              )}
            </div>
          </div>

          <Card className="px-0 py-2">
            {filteredInvoices.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No matching invoices logged.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>GST (CGST/SGST)</TableHead>
                    <TableHead>Total sum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{i.invoiceNo}</TableCell>
                      <TableCell className="font-semibold text-xs truncate max-w-[150px]">{i.clientName}</TableCell>
                      <TableCell className="text-xs">{i.dueDate}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {i.cgst > 0 ? `₹${(i.cgst + i.sgst).toLocaleString("en-IN")}` : `IGST: ₹${i.igst.toLocaleString("en-IN")}`}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">₹{i.total.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Badge variant={i.status === "PAID" ? "success" : i.status === "PARTIALLY_PAID" ? "warning" : "destructive"}>
                          {i.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => triggerDownloadInvoice(i.invoiceNo)}
                            className="p-1 rounded bg-muted/60 text-slate-500 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            title="Download PDF Invoice"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          {i.status !== "PAID" && checkPermission("billing:invoice") && (
                            <button
                              onClick={() => handleOpenPaymentModal(i)}
                              className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold inline-flex items-center cursor-pointer"
                            >
                              Log Payment
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>

        {/* Payment receipts timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center text-primary"><Receipt className="w-4.5 h-4.5 mr-2" /> Collection Receipts Log</CardTitle>
            <CardDescription>Bi-weekly fee deposits audit trail.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {payments.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No payment receipts logged yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.slice(0, 5).map((pay) => (
                    <TableRow key={pay.id}>
                      <TableCell className="font-semibold text-xs">
                        <div>{pay.receiptNo}</div>
                        <span className="text-[9px] text-muted-foreground block truncate max-w-[100px]">{pay.clientName}</span>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-emerald-500">₹{pay.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">{pay.paymentMode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Generate Invoice Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Generate GST Compliant Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Client Target *</label>
            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">-- Mapped Client --</option>
              {clients
                .filter((c) => activeBranch === "all" || c.branchId === activeBranch)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Fee SubTotal (₹) *</label>
              <input
                type="number"
                required
                value={subTotal}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setSubTotal(e.target.value);
                  setCgst(String(Math.round(val * 0.09)));
                  setSgst(String(Math.round(val * 0.09)));
                }}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Invoice Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-muted/10 p-3 rounded-lg border border-border/40">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">CGST (9%)</label>
              <input
                type="number"
                value={cgst}
                onChange={(e) => setCgst(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">SGST (9%)</label>
              <input
                type="number"
                value={sgst}
                onChange={(e) => setSgst(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">IGST (18%)</label>
              <input
                type="number"
                value={igst}
                onChange={(e) => setIgst(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary bg-card"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Special Billing Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., quarterly audit retainer fee invoice."
              className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm"
            >
              Generate GST Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Record Collection Receipt">
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="bg-muted/10 p-3 rounded-lg border border-border/60 mb-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">Collect fees for</span>
            <span className="text-sm font-semibold text-foreground">{selectedInvoice?.invoiceNo}</span>
            <span className="text-xs text-muted-foreground block mt-0.5">Client: {selectedInvoice?.clientName} • Total Invoice Value: ₹{selectedInvoice?.total}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="UPI">UPI Transfer</option>
                <option value="BANK_TRANSFER">Bank Net-banking</option>
                <option value="CHEQUE">Corporate Cheque</option>
                <option value="CASH">Physical Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Receipt amount Paid (₹) *</label>
              <input
                type="number"
                required
                value={paymentAmt}
                onChange={(e) => setPaymentAmt(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Reference Transaction Code / Cheque No *</label>
            <input
              type="text"
              required
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="UPI998120391 or UTIB00029"
              className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="px-3 py-1.5 border border-border/60 text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm"
            >
              Confirm receipt
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
