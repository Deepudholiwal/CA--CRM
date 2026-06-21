"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  BRANCHES,
  EMPLOYEES,
  CLIENTS,
  FILINGS,
  TASKS,
  INVOICES,
  PAYMENTS,
  LEADS,
  DOCUMENTS,
  NOTICES,
  WHATSAPP_LOGS,
  ARTICLES,
  MockBranch,
  MockEmployee,
  MockClient,
  MockTask,
  MockInvoice,
  MockPayment,
  MockLead,
  MockDocument,
  MockNotice,
  MockWhatsAppLog,
  MockFiling,
  MockArticle,
} from "../utils/dummyData";

// Define Tenant/Subscription Tiers
export interface TenantConfig {
  name: string;
  slug: string;
  plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  status: "ACTIVE" | "TRIAL" | "PAST_DUE";
  brandingColor: string;
}

// Roles and their simulated permissions
export interface RolePermissions {
  role: string;
  permissions: string[];
  description: string;
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: "Super Admin",
    permissions: ["all"],
    description: "Full global access to all branches, billing, and settings.",
  },
  {
    role: "CA Partner",
    permissions: [
      "client:create", "client:edit", "client:delete",
      "task:create", "task:edit", "task:delete",
      "employee:view", "employee:edit",
      "billing:invoice", "billing:view",
      "notice:respond", "notice:escalate",
      "ai:analyze", "settings:edit"
    ],
    description: "Full operational access, document approval, partner sign-offs.",
  },
  {
    role: "Manager",
    permissions: [
      "client:create", "client:edit",
      "task:create", "task:edit", "task:delete",
      "employee:view",
      "billing:invoice", "billing:view",
      "notice:respond",
      "ai:analyze"
    ],
    description: "Manage tasks, employees, billing review, client updates.",
  },
  {
    role: "Accountant",
    permissions: [
      "client:create", "client:edit",
      "task:edit",
      "billing:invoice", "billing:view",
      "ai:analyze"
    ],
    description: "Create invoices, reconcile GST receipts, update task checklists.",
  },
  {
    role: "Tax Consultant",
    permissions: [
      "client:view", "client:edit",
      "task:edit",
      "notice:respond",
      "ai:analyze"
    ],
    description: "Prepare GST & ITR returns, response drafting, notice analysis.",
  },
  {
    role: "Data Entry Operator",
    permissions: [
      "client:view",
      "task:view",
      "document:upload",
    ],
    description: "Upload client bank statements, basic document categorization.",
  },
  {
    role: "Client",
    permissions: [
      "portal:view",
      "portal:upload",
      "portal:invoice",
      "portal:chat"
    ],
    description: "Portal access only: upload documents, view filings, pay invoices.",
  },
];

interface DatabaseContextType {
  // Config
  tenant: TenantConfig;
  setTenant: (t: TenantConfig) => void;
  activeRole: string;
  setActiveRole: (r: string) => void;
  activeBranch: string; // "all" or specific branchId
  setActiveBranch: (b: string) => void;
  
  // Data lists
  branches: MockBranch[];
  employees: MockEmployee[];
  clients: MockClient[];
  filings: MockFiling[];
  tasks: MockTask[];
  invoices: MockInvoice[];
  payments: MockPayment[];
  leads: MockLead[];
  documents: MockDocument[];
  notices: MockNotice[];
  whatsappLogs: MockWhatsAppLog[];
  articles: MockArticle[];
  
  // CRUD Actions
  addClient: (c: Omit<MockClient, "id" | "clientId" | "createdAt">) => void;
  editClient: (id: string, c: Partial<MockClient>) => void;
  deleteClient: (id: string) => void;
  
  addLead: (l: Omit<MockLead, "id" | "createdAt">) => void;
  updateLeadStage: (id: string, stage: string) => void;
  updateLead: (id: string, l: Partial<MockLead>) => void;
  addLeadComment: (leadId: string, comment: string, employeeName: string) => void;
  
  addTask: (t: Omit<MockTask, "id" | "createdAt" | "comments">) => void;
  updateTaskStatus: (id: string, status: string) => void;
  addTaskComment: (taskId: string, comment: string, employeeName: string) => void;
  
  addInvoice: (inv: Omit<MockInvoice, "id" | "invoiceNo" | "createdAt">) => void;
  payInvoice: (invoiceId: string, paymentMode: string, referenceNo: string, amount: number) => void;
  
  addDocument: (doc: Omit<MockDocument, "id" | "createdAt" | "version" | "isApproved" | "esignStatus" | "ocrData">) => void;
  approveDocument: (docId: string) => void;
  updateEsignStatus: (docId: string, status: string) => void;
  runOCR: (docId: string, mockData: any) => void;
  
  resolveNotice: (noticeId: string, resolutionDetails: string) => void;
  escalateNotice: (noticeId: string, partnerName: string) => void;
  
  sendWhatsAppNotification: (clientId: string, msg: string) => void;
  runWorkflowAutomation: (trigger: string, contextData: any) => void;
  
  checkPermission: (permission: string) => boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  // Global Config state
  const [tenant, setTenant] = useState<TenantConfig>({
    name: "Deepak Yadav & Associates",
    slug: "deepak-yadav-ca",
    plan: "PROFESSIONAL",
    status: "ACTIVE",
    brandingColor: "indigo"
  });
  
  const [activeRole, setActiveRole] = useState<string>("CA Partner");
  const [activeBranch, setActiveBranch] = useState<string>("all");

  // Core Data States loaded from LocalStorage or dummyData
  const [clients, setClients] = useState<MockClient[]>([]);
  const [branches] = useState<MockBranch[]>(BRANCHES);
  const [employees, setEmployees] = useState<MockEmployee[]>(EMPLOYEES);
  const [filings, setFilings] = useState<MockFiling[]>([]);
  const [tasks, setTasks] = useState<MockTask[]>([]);
  const [invoices, setInvoices] = useState<MockInvoice[]>([]);
  const [payments, setPayments] = useState<MockPayment[]>([]);
  const [leads, setLeads] = useState<MockLead[]>([]);
  const [documents, setDocuments] = useState<MockDocument[]>([]);
  const [notices, setNotices] = useState<MockNotice[]>([]);
  const [whatsappLogs, setWhatsappLogs] = useState<MockWhatsAppLog[]>([]);
  const [articles] = useState<MockArticle[]>(ARTICLES);

  // Initialize and load from localstorage
  useEffect(() => {
    const localGet = (key: string, defaultVal: any) => {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    };

    setClients(localGet("ca_clients", CLIENTS));
    setFilings(localGet("ca_filings", FILINGS));
    setTasks(localGet("ca_tasks", TASKS));
    setInvoices(localGet("ca_invoices", INVOICES));
    setPayments(localGet("ca_payments", PAYMENTS));
    setLeads(localGet("ca_leads", LEADS));
    setDocuments(localGet("ca_documents", DOCUMENTS));
    setNotices(localGet("ca_notices", NOTICES));
    setWhatsappLogs(localGet("ca_whatsapp_logs", WHATSAPP_LOGS));
  }, []);

  // Helpers to save state
  const save = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // RBAC check function
  const checkPermission = (permission: string) => {
    const roleDef = ROLE_PERMISSIONS.find((rp) => rp.role === activeRole);
    if (!roleDef) return false;
    if (roleDef.permissions.includes("all")) return true;
    return roleDef.permissions.includes(permission);
  };

  // CRUD Implementations
  const addClient = (c: Omit<MockClient, "id" | "clientId" | "createdAt">) => {
    const code = `CA-CLI-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClient: MockClient = {
      ...c,
      id: `cli-${Date.now()}`,
      clientId: code,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    save("ca_clients", updated);
    
    // Auto Trigger Workflow
    runWorkflowAutomation("CLIENT_CREATED", newClient);
  };

  const editClient = (id: string, updatedFields: Partial<MockClient>) => {
    const updated = clients.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    setClients(updated);
    save("ca_clients", updated);
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    save("ca_clients", updated);
  };

  const addLead = (l: Omit<MockLead, "id" | "createdAt">) => {
    const newLead: MockLead = {
      ...l,
      id: `led-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    save("ca_leads", updated);
  };

  const updateLeadStage = (id: string, stage: string) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, stage } : l));
    setLeads(updated);
    save("ca_leads", updated);

    // If won, automatically convert to client
    const targetLead = leads.find((l) => l.id === id);
    if (stage === "WON" && targetLead) {
      addClient({
        name: targetLead.companyName || targetLead.name,
        mobile: targetLead.mobile,
        email: targetLead.email,
        pan: "",
        aadhaar: "",
        gstin: "",
        tan: "",
        businessType: "INDIVIDUAL",
        category: "RETAIL",
        status: "ONBOARDING",
        address: "",
        city: "",
        state: "",
        contactPerson: targetLead.name,
        notes: `Converted from lead. Original notes: ${targetLead.notes || ""}`,
        branchId: targetLead.branchId,
      });
    }
  };

  const updateLead = (id: string, l: Partial<MockLead>) => {
    const updated = leads.map((lead) => (lead.id === id ? { ...lead, ...l } : lead));
    setLeads(updated);
    save("ca_leads", updated);
  };

  const addLeadComment = (leadId: string, comment: string, employeeName: string) => {
    const newComment = {
      id: `lc-${Date.now()}`,
      employeeName,
      comment,
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          comments: [...(l.comments || []), newComment]
        };
      }
      return l;
    });
    setLeads(updated);
    save("ca_leads", updated);
  };

  const addTask = (t: Omit<MockTask, "id" | "createdAt" | "comments">) => {
    const newTask: MockTask = {
      ...t,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      comments: [],
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    save("ca_tasks", updated);
  };

  const updateTaskStatus = (id: string, status: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    setTasks(updated);
    save("ca_tasks", updated);
  };

  const addTaskComment = (taskId: string, comment: string, employeeName: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [
            ...t.comments,
            {
              id: `c-${Date.now()}`,
              employeeName,
              comment,
              createdAt: new Date().toLocaleDateString("en-IN") + " " + new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        };
      }
      return t;
    });
    setTasks(updated);
    save("ca_tasks", updated);
  };

  const addInvoice = (inv: Omit<MockInvoice, "id" | "invoiceNo" | "createdAt">) => {
    const invNo = `INV/2026/${String(invoices.length + 1).padStart(4, "0")}`;
    const newInvoice: MockInvoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNo: invNo,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    save("ca_invoices", updated);
  };

  const payInvoice = (invoiceId: string, paymentMode: string, referenceNo: string, amount: number) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;

    // Create Payment Receipt
    const receiptNo = `REC-2026-${String(payments.length + 1).padStart(4, "0")}`;
    const newPayment: MockPayment = {
      id: `pay-${Date.now()}`,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      invoiceId: invoiceId,
      receiptNo,
      amount,
      paymentMode,
      referenceNo,
      paymentDate: new Date().toISOString().split("T")[0],
    };
    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    save("ca_payments", updatedPayments);

    // Update Invoice Status
    const isFullPay = amount >= invoice.total;
    const updatedInvoices = invoices.map((i) => {
      if (i.id === invoiceId) {
        return {
          ...i,
          status: isFullPay ? "PAID" : "PARTIALLY_PAID",
        };
      }
      return i;
    });
    setInvoices(updatedInvoices);
    save("ca_invoices", updatedInvoices);
  };

  const addDocument = (doc: Omit<MockDocument, "id" | "createdAt" | "version" | "isApproved" | "esignStatus" | "ocrData">) => {
    const newDoc: MockDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      version: 1,
      isApproved: false,
      esignStatus: "PENDING",
      ocrData: null,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    save("ca_documents", updated);
  };

  const approveDocument = (docId: string) => {
    const updated = documents.map((d) => (d.id === docId ? { ...d, isApproved: true } : d));
    setDocuments(updated);
    save("ca_documents", updated);
  };

  const updateEsignStatus = (docId: string, esignStatus: string) => {
    const updated = documents.map((d) => (d.id === docId ? { ...d, esignStatus } : d));
    setDocuments(updated);
    save("ca_documents", updated);
  };

  const runOCR = (docId: string, ocrData: any) => {
    const updated = documents.map((d) => (d.id === docId ? { ...d, ocrData } : d));
    setDocuments(updated);
    save("ca_documents", updated);
  };

  const resolveNotice = (noticeId: string, resolutionDetails: string) => {
    const updated = notices.map((n) => (n.id === noticeId ? { ...n, status: "CLOSED", extractedNotes: n.extractedNotes + `\n[Resolution]: ${resolutionDetails}` } : n));
    setNotices(updated);
    save("ca_notices", updated);
  };

  const escalateNotice = (noticeId: string, partnerName: string) => {
    const updated = notices.map((n) => (n.id === noticeId ? { ...n, status: "ESCALATED", escalatedTo: partnerName } : n));
    setNotices(updated);
    save("ca_notices", updated);
  };

  const sendWhatsAppNotification = (clientId: string, msg: string) => {
    const client = clients.find((c) => c.id === clientId);
    const newLog: MockWhatsAppLog = {
      id: `wa-${Date.now()}`,
      clientId,
      clientName: client ? client.name : "Unknown",
      message: msg,
      status: "SENT",
      direction: "OUTGOING",
      timestamp: new Date().toISOString().split("T")[0] + " " + new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [newLog, ...whatsappLogs];
    setWhatsappLogs(updated);
    save("ca_whatsapp_logs", updated);

    // Simulate status update (Read after 2 seconds)
    setTimeout(() => {
      setWhatsappLogs((prevLogs) =>
        prevLogs.map((log) => (log.id === newLog.id ? { ...log, status: "READ" } : log))
      );
    }, 2000);
  };

  // Workflow Automation Engine
  const runWorkflowAutomation = (trigger: string, contextData: any) => {
    console.log(`[Workflow Engine]: Triggered ${trigger}`, contextData);

    if (trigger === "CLIENT_CREATED") {
      // 1. Auto Create Onboarding Checklist Tasks
      addTask({
        clientId: contextData.id,
        clientName: contextData.name,
        title: "Collect KYC & Incorporation Documents",
        description: "Request PAN, Aadhaar, MOA/AOA, and GST certificates for directory initialization.",
        priority: "HIGH",
        status: "PENDING",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        assignedToId: "emp-5", // Data Entry Operator Vikram
        assignedToName: "Vikram Singh",
        createdById: "emp-1",
      });

      addTask({
        clientId: contextData.id,
        clientName: contextData.name,
        title: "GST Scrutiny Setup",
        description: "Configure portal access and map client GSTIN into GSTR-2B automated matching sheets.",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        assignedToId: "emp-6", // Sunita Rao (GST Specialist)
        assignedToName: "Sunita Rao",
        createdById: "emp-1",
      });

      // 2. Auto send WhatsApp Welcome message
      sendWhatsAppNotification(
        contextData.id,
        `Welcome ${contextData.name} to ${tenant.name}! We have initiated your onboarding. Please upload your KYC documents on our client portal.`
      );
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        tenant,
        setTenant,
        activeRole,
        setActiveRole,
        activeBranch,
        setActiveBranch,
        branches,
        employees,
        clients,
        filings,
        tasks,
        invoices,
        payments,
        leads,
        documents,
        notices,
        whatsappLogs,
        articles,
        
        addClient,
        editClient,
        deleteClient,
        addLead,
        updateLeadStage,
        updateLead,
        addLeadComment,
        addTask,
        updateTaskStatus,
        addTaskComment,
        addInvoice,
        payInvoice,
        addDocument,
        approveDocument,
        updateEsignStatus,
        runOCR,
        resolveNotice,
        escalateNotice,
        sendWhatsAppNotification,
        runWorkflowAutomation,
        checkPermission,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
