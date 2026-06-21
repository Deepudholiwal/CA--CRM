"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import LeadPipeline from "../../components/sections/LeadPipeline";
import WorkflowEngine from "../../components/sections/WorkflowEngine";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Phone,
  Mail,
  FileText,
  Clock,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  FolderOpen,
  Filter,
  CheckCircle,
  Eye,
  Check,
  ChevronRight,
  User,
  Workflow
} from "lucide-react";

export default function ClientsPage() {
  const {
    clients,
    activeBranch,
    branches,
    addClient,
    editClient,
    deleteClient,
    checkPermission,
    filings,
    payments,
    documents,
    notices,
    whatsappLogs,
    tasks
  } = useDatabase();

  const [activeTab, setActiveTab] = useState<"clients" | "leads" | "workflows">("clients");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [gstin, setGstin] = useState("");
  const [tan, setTan] = useState("");
  const [businessType, setBusinessType] = useState("INDIVIDUAL");
  const [category, setCategory] = useState("RETAIL");
  const [status, setStatus] = useState("ONBOARDING");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [notes, setNotes] = useState("");
  const [clientBranch, setClientBranch] = useState("br-delhi");

  // Filter Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchBranch = activeBranch === "all" || c.branchId === activeBranch;
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.pan && c.pan.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.gstin && c.gstin.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchCategory = categoryFilter === "all" || c.category === categoryFilter;

      return matchBranch && matchSearch && matchStatus && matchCategory;
    });
  }, [clients, activeBranch, searchQuery, statusFilter, categoryFilter]);

  const handleOpenAddModal = () => {
    setName("");
    setMobile("");
    setEmail("");
    setPan("");
    setAadhaar("");
    setGstin("");
    setTan("");
    setBusinessType("INDIVIDUAL");
    setCategory("RETAIL");
    setStatus("ONBOARDING");
    setAddress("");
    setCity("");
    setState("");
    setContactPerson("");
    setNotes("");
    setClientBranch(activeBranch === "all" ? "br-delhi" : activeBranch);
    setShowAddModal(true);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !email) return;
    addClient({
      name,
      mobile,
      email,
      pan,
      aadhaar,
      gstin,
      tan,
      businessType: businessType as any,
      category: category as any,
      status: status as any,
      address,
      city,
      state,
      contactPerson,
      notes,
      branchId: clientBranch,
    });
    setShowAddModal(false);
  };

  const handleOpenEditModal = (client: any) => {
    setSelectedClient(client);
    setName(client.name);
    setMobile(client.mobile);
    setEmail(client.email);
    setPan(client.pan);
    setAadhaar(client.aadhaar);
    setGstin(client.gstin);
    setTan(client.tan);
    setBusinessType(client.businessType);
    setCategory(client.category);
    setStatus(client.status);
    setAddress(client.address || "");
    setCity(client.city || "");
    setState(client.state || "");
    setContactPerson(client.contactPerson || "");
    setNotes(client.notes || "");
    setClientBranch(client.branchId);
    setShowEditModal(true);
  };

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    editClient(selectedClient.id, {
      name,
      mobile,
      email,
      pan,
      aadhaar,
      gstin,
      tan,
      businessType: businessType as any,
      category: category as any,
      status: status as any,
      address,
      city,
      state,
      contactPerson,
      notes,
      branchId: clientBranch,
    });
    setShowEditModal(false);
  };

  const handleOpenProfileDrawer = (client: any) => {
    setSelectedClient(client);
    setShowProfileDrawer(true);
  };

  // Compile specific client relationship timelines
  const clientFilings = filings.filter((f) => f.clientId === selectedClient?.id);
  const clientPayments = payments.filter((p) => p.clientId === selectedClient?.id);
  const clientNotices = notices.filter((n) => n.clientId === selectedClient?.id);
  const clientDocs = documents.filter((d) => d.clientId === selectedClient?.id);
  const clientWaLogs = whatsappLogs.filter((w) => w.clientId === selectedClient?.id);
  const clientTasks = tasks.filter((t) => t.clientId === selectedClient?.id);

  return (
    <div className="space-y-6">
      
      {/* Navigation tabs */}
      <div className="flex border-b border-border/60 pb-1">
        <button
          onClick={() => setActiveTab("clients")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "clients"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> Active Clients</span>
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "leads"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center"><Eye className="w-4 h-4 mr-1.5" /> Leads & Pipeline</span>
        </button>
        <button
          onClick={() => setActiveTab("workflows")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "workflows"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center"><Workflow className="w-4 h-4 mr-1.5" /> Workflow Automations</span>
        </button>
      </div>

      {/* RENDER TAB 1: CLIENTS */}
      {activeTab === "clients" && (
        <div className="space-y-4">
          
          {/* Filters & search banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 p-4 rounded-xl shadow-sm">
            <div className="flex flex-1 items-center space-x-2.5 max-w-md">
              <div className="relative w-full">
                <Search className="absolute inset-y-0 left-0 pl-3 flex items-center w-4 h-4 my-auto text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by client name, PAN, GSTIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ONBOARDING">Onboarding</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="PLATINUM">Platinum Tier</option>
                <option value="GOLD">Gold Tier</option>
                <option value="RETAIL">Retail Tier</option>
              </select>

              {checkPermission("client:create") && (
                <button
                  onClick={handleOpenAddModal}
                  className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center cursor-pointer shadow-sm ml-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Client
                </button>
              )}
            </div>
          </div>

          {/* Client Directory Grid */}
          <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
            {filteredClients.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm font-semibold text-muted-foreground">No active clients found</p>
                <p className="text-xs text-muted-foreground/80 mt-1">Try modifying your search or branch filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Company & Client Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>GSTIN / PAN</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{c.clientId}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        <div className="font-semibold text-foreground leading-snug">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground leading-none mt-0.5">{c.email}</div>
                      </TableCell>
                      <TableCell className="text-xs">{c.mobile}</TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{c.businessType.replace("_", " ")}</TableCell>
                      <TableCell className="text-xs font-mono">
                        <div className="font-medium">{c.gstin || "N/A"}</div>
                        <div className="text-[10px] text-muted-foreground">{c.pan || "N/A"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.category === "PLATINUM" ? "default" : c.category === "GOLD" ? "warning" : "secondary"}>
                          {c.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.status === "ACTIVE" ? "success" : c.status === "ONBOARDING" ? "info" : "destructive"}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenProfileDrawer(c)}
                            className="p-1 rounded bg-muted/60 text-slate-500 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            title="Relationship timeline profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {checkPermission("client:edit") && (
                            <button
                              onClick={() => handleOpenEditModal(c)}
                              className="p-1 rounded bg-muted/60 text-slate-500 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                              title="Edit Client"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {checkPermission("client:delete") && (
                            <button
                              onClick={() => deleteClient(c.id)}
                              className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                              title="Delete Client"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}

      {/* RENDER TAB 2: LEADS */}
      {activeTab === "leads" && <LeadPipeline />}

      {/* RENDER TAB 3: WORKFLOWS */}
      {activeTab === "workflows" && <WorkflowEngine />}

      {/* Add Client Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Register New Client Record">
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Client Legal Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ravi Malhotra & Co."
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Corporate Branch</label>
              <select
                value={clientBranch}
                onChange={(e) => setClientBranch(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Mobile number *</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9812301290"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Email ID *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ravi@malhotra.com"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">PAN Card Number</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="ABCDE1234F"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Aadhaar Number</label>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="123456789012"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="06ABCDE1234F1Z9"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">TAN Number</label>
              <input
                type="text"
                value={tan}
                onChange={(e) => setTan(e.target.value)}
                placeholder="DELM12345B"
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="PROPRIETORSHIP">Proprietorship</option>
                <option value="PARTNERSHIP">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="PRIVATE_LIMITED">Private Ltd</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="RETAIL">Retail</option>
                <option value="GOLD">Gold</option>
                <option value="PLATINUM">Platinum</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Onboarding Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="ONBOARDING">Onboarding</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
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
              Onboard Client
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Client Details: ${selectedClient?.name}`}>
        <form onSubmit={handleUpdateClient} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Client Legal Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Corporate Branch</label>
              <select
                value={clientBranch}
                onChange={(e) => setClientBranch(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Mobile *</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Email ID *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">PAN Card</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Aadhaar</label>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">TAN</label>
              <input
                type="text"
                value={tan}
                onChange={(e) => setTan(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="PROPRIETORSHIP">Proprietorship</option>
                <option value="PARTNERSHIP">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="PRIVATE_LIMITED">Private Ltd</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="RETAIL">Retail</option>
                <option value="GOLD">Gold</option>
                <option value="PLATINUM">Platinum</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="ONBOARDING">Onboarding</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-3 py-1.5 border border-border/60 text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted cursor-pointer"
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
      </Modal>

      {/* Client Profile / Relationship Timeline Drawer Modal */}
      <Modal isOpen={showProfileDrawer} onClose={() => setShowProfileDrawer(false)} size="xl" title={`Client Portal Timeline: ${selectedClient?.name}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          {/* Left panel: Info summary */}
          <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/60 h-fit">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Legal Entity Details</span>
              <h4 className="text-sm font-bold text-foreground mt-1">{selectedClient?.name}</h4>
              <Badge variant="default" className="mt-1.5">{selectedClient?.clientId}</Badge>
            </div>

            <div className="space-y-2 border-t border-border/30 pt-3 text-xs text-foreground/80">
              <div><span className="font-semibold text-muted-foreground">Mobile:</span> {selectedClient?.mobile}</div>
              <div><span className="font-semibold text-muted-foreground">Email:</span> {selectedClient?.email}</div>
              <div><span className="font-semibold text-muted-foreground">PAN:</span> {selectedClient?.pan || "N/A"}</div>
              <div><span className="font-semibold text-muted-foreground">GSTIN:</span> {selectedClient?.gstin || "N/A"}</div>
              <div><span className="font-semibold text-muted-foreground">Category:</span> {selectedClient?.category}</div>
              <div><span className="font-semibold text-muted-foreground">Status:</span> {selectedClient?.status}</div>
            </div>

            {selectedClient?.notes && (
              <div className="border-t border-border/30 pt-3">
                <span className="text-[10px] text-muted-foreground font-bold uppercase block">Partner Notes</span>
                <p className="text-[11px] text-foreground/90 mt-1 leading-normal italic">
                  "{selectedClient.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Right panel: Timeline feeds */}
          <div className="md:col-span-2 space-y-5">
            
            {/* 1. Filing Returns Timeline */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-primary" /> Filing Compliance History
              </h5>
              {clientFilings.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic">No filing records mapped.</p>
              ) : (
                <div className="space-y-2.5">
                  {clientFilings.map((f) => (
                    <div key={f.id} className="flex justify-between items-center p-2.5 bg-card border border-border/40 rounded-lg text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{f.type} ({f.period})</span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">Due date: {f.dueDate}</span>
                      </div>
                      <Badge variant={f.status === "FILED" ? "success" : f.status === "PENDING" ? "default" : "destructive"}>
                        {f.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Uploaded Documents Folder */}
            <div className="border-t border-border/20 pt-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                <FolderOpen className="w-4 h-4 mr-1.5 text-primary" /> Document Repository & Vault
              </h5>
              {clientDocs.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic">No files uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {clientDocs.map((d) => (
                    <div key={d.id} className="p-2 border border-border/40 rounded-lg text-xs flex items-center justify-between bg-card">
                      <span className="truncate max-w-[120px] font-medium" title={d.name}>{d.name}</span>
                      <Badge variant={d.isApproved ? "success" : "secondary"} className="scale-75">
                        {d.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. WhatsApp Communications Logs */}
            <div className="border-t border-border/20 pt-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1.5 text-primary" /> WhatsApp Communications Timeline
              </h5>
              {clientWaLogs.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic">No communication logs recorded.</p>
              ) : (
                <div className="space-y-2 border-l border-border/60 pl-3">
                  {clientWaLogs.map((w) => (
                    <div key={w.id} className="relative text-xs leading-normal">
                      <div className="absolute -left-[17.5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="font-semibold text-foreground block text-[10px]">{w.timestamp}</span>
                      <p className="text-muted-foreground mt-0.5">{w.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Notices Tracking */}
            {clientNotices.length > 0 && (
              <div className="border-t border-border/20 pt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5 text-red-500" /> Active Tax Scrutiny Notices
                </h5>
                <div className="space-y-2">
                  {clientNotices.map((n) => (
                    <div key={n.id} className="p-2.5 border border-red-500/20 bg-red-500/5 rounded-lg text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-red-600 dark:text-red-400">{n.noticeSection} ({n.status})</span>
                        <Badge variant="destructive">{n.severity}</Badge>
                      </div>
                      <p className="text-muted-foreground text-[10px] mt-1 leading-snug">{n.extractedNotes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Payments History */}
            <div className="border-t border-border/20 pt-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                <CreditCard className="w-4 h-4 mr-1.5 text-primary" /> Receipt Payments History
              </h5>
              {clientPayments.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic">No payments logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {clientPayments.map((p) => (
                    <div key={p.id} className="flex justify-between items-center p-2 bg-card border border-border/40 rounded-lg text-[10px]">
                      <div>
                        <span className="font-semibold text-foreground">₹{p.amount.toLocaleString("en-IN")} via {p.paymentMode}</span>
                        <span className="text-[9px] text-muted-foreground block">Ref: {p.referenceNo}</span>
                      </div>
                      <span className="font-bold text-emerald-500">{p.paymentDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </Modal>

    </div>
  );
}
