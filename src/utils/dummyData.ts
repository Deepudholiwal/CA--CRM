export enum BusinessType {
  PROPRIETORSHIP = "PROPRIETORSHIP",
  PARTNERSHIP = "PARTNERSHIP",
  LLP = "LLP",
  PRIVATE_LIMITED = "PRIVATE_LIMITED",
  PUBLIC_LIMITED = "PUBLIC_LIMITED",
  INDIVIDUAL = "INDIVIDUAL",
  HUF = "HUF",
  TRUST = "TRUST"
}

export enum ClientCategory {
  RETAIL = "RETAIL",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM"
}

export enum ClientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ONBOARDING = "ONBOARDING"
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  COMPLETED = "COMPLETED"
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  UNPAID = "UNPAID",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  PARTIALLY_PAID = "PARTIALLY_PAID"
}

// Mock Types matching Prisma Schema
export interface MockBranch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  gstin: string;
}

export interface MockEmployee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  mobile: string;
  branchId: string;
  salary: number;
  joiningDate: string;
  performanceScore: number; // 0 - 100
}

export interface MockClient {
  id: string;
  clientId: string;
  name: string;
  mobile: string;
  email: string;
  pan: string;
  aadhaar: string;
  gstin: string;
  tan: string;
  businessType: string;
  category: string;
  status: string;
  address: string;
  city: string;
  state: string;
  contactPerson: string;
  notes: string;
  branchId: string;
  createdAt: string;
}

export interface MockTask {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  priority: string;
  status: string;
  dueDate: string;
  assignedToId: string;
  assignedToName: string;
  createdById: string;
  createdAt: string;
  comments: { id: string; employeeName: string; comment: string; createdAt: string }[];
}

export interface MockInvoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  branchId: string;
  dueDate: string;
  subTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  status: string;
  createdAt: string;
  notes?: string;
}

export interface MockPayment {
  id: string;
  clientId: string;
  clientName: string;
  invoiceId: string | null;
  receiptNo: string;
  amount: number;
  paymentMode: string;
  referenceNo: string;
  paymentDate: string;
}

export interface MockLeadComment {
  id: string;
  employeeName: string;
  comment: string;
  createdAt: string;
}

export interface MockLead {
  id: string;
  name: string;
  companyName: string;
  mobile: string;
  email: string;
  source: string;
  stage: string; // NEW, PROPOSAL_SENT, NEGOTIATION, WON, LOST
  estimatedValue: number;
  notes: string;
  branchId: string;
  createdAt: string;
  comments?: MockLeadComment[];
}

export interface MockDocument {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  category: string; // PAN, AADHAAR, GST_CERT, BANK_STMT, AUDIT_REP, ITR_ACK, ROC_DOC
  version: number;
  isApproved: boolean;
  esignStatus: string; // PENDING, SENT, COMPLETED, REJECTED
  ocrData: any | null;
  createdAt: string;
}

export interface MockNotice {
  id: string;
  clientId: string;
  clientName: string;
  issuingAuthority: string; // INCOME_TAX, GST, ROC
  noticeSection: string;
  noticeNumber: string;
  issueDate: string;
  dueDate: string;
  status: string; // OPEN, RESPONDED, CLOSED, ESCALATED
  severity: string; // HIGH, MEDIUM, LOW
  escalatedTo: string | null;
  extractedNotes: string;
}

export interface MockWhatsAppLog {
  id: string;
  clientId: string;
  clientName: string;
  message: string;
  status: string; // SENT, DELIVERED, READ, FAILED
  direction: string; // OUTGOING, INCOMING
  timestamp: string;
}

export interface MockFiling {
  id: string;
  clientId: string;
  clientName: string;
  module: "GST" | "ITR" | "TDS" | "ROC";
  type: string; // GSTR1, ITR4, 26Q, AOC-4 etc.
  period: string;
  dueDate: string;
  filedDate: string | null;
  status: string; // PENDING, IN_PROGRESS, FILED, OVERDUE
  referenceNo: string | null;
  taxPaid: number | null;
}

export interface MockArticle {
  id: string;
  title: string;
  category: string; // GST, INCOME_TAX, ROC, INTERNAL_SOP
  content: string;
  tags: string[];
  updatedAt: string;
}

// ---------------- DUMMY DATA DEFINITIONS ----------------

export const BRANCHES: MockBranch[] = [
  { id: "br-delhi", name: "Delhi NCR Head Office", code: "DEL-01", address: "Plot 12, Sector 18, Udyog Vihar", city: "Gurugram", state: "Haryana", gstin: "06AAAAA1111A1Z1" },
  { id: "br-mumbai", name: "Mumbai Corporate Branch", code: "MUM-02", address: "508, Maker Chambers V, Nariman Point", city: "Mumbai", state: "Maharashtra", gstin: "27BBBBB2222B2Z2" },
  { id: "br-bangalore", name: "Bangalore Tech Branch", code: "BLR-03", address: "102, 4th Cross, Koramangala 5th Block", city: "Bengaluru", state: "Karnataka", gstin: "29CCCCC3333C3Z3" },
];

export const EMPLOYEES: MockEmployee[] = [
  { id: "emp-1", employeeId: "CA-EMP-101", name: "Deepak Yadav", email: "deepak@cafirm.com", role: "CA_PARTNER", designation: "Senior Partner", mobile: "9876543210", branchId: "br-delhi", salary: 150000, joiningDate: "2018-04-15", performanceScore: 95 },
  { id: "emp-2", employeeId: "CA-EMP-102", name: "Ananya Sharma", email: "ananya@cafirm.com", role: "MANAGER", designation: "Audit Manager", mobile: "9876543211", branchId: "br-mumbai", salary: 95000, joiningDate: "2020-07-01", performanceScore: 88 },
  { id: "emp-3", employeeId: "CA-EMP-103", name: "Amit Patel", email: "amit@cafirm.com", role: "TAX_CONSULTANT", designation: "Taxation Specialist", mobile: "9876543212", branchId: "br-delhi", salary: 75000, joiningDate: "2021-11-10", performanceScore: 92 },
  { id: "emp-4", employeeId: "CA-EMP-104", name: "Priya Nair", email: "priya@cafirm.com", role: "ACCOUNTANT", designation: "Senior Accountant", mobile: "9876543213", branchId: "br-bangalore", salary: 60000, joiningDate: "2022-02-18", performanceScore: 84 },
  { id: "emp-5", employeeId: "CA-EMP-105", name: "Vikram Singh", email: "vikram@cafirm.com", role: "DATA_ENTRY", designation: "Data Entry Operator", mobile: "9876543214", branchId: "br-delhi", salary: 30000, joiningDate: "2023-09-01", performanceScore: 79 },
  { id: "emp-6", employeeId: "CA-EMP-106", name: "Sunita Rao", email: "sunita@cafirm.com", role: "TAX_CONSULTANT", designation: "GST Specialist", mobile: "9876543215", branchId: "br-mumbai", salary: 72000, joiningDate: "2022-08-05", performanceScore: 86 },
];

export const CLIENTS: MockClient[] = [
  {
    id: "cli-1",
    clientId: "CA-CLI-1001",
    name: "Acme Tech Solutions Private Limited",
    mobile: "9123456780",
    email: "finance@acmetech.com",
    pan: "AABCA1234F",
    aadhaar: "123456789012",
    gstin: "06AABCA1234F1Z9",
    tan: "DELA12345B",
    businessType: "PRIVATE_LIMITED",
    category: "PLATINUM",
    status: "ACTIVE",
    address: "244, Udyog Vihar Phase 4",
    city: "Gurugram",
    state: "Haryana",
    contactPerson: "Siddharth Mehta (Director)",
    notes: "Requires complete compliance package including statutory audit, monthly GST filing, and corporate ITR-6.",
    branchId: "br-delhi",
    createdAt: "2024-01-10",
  },
  {
    id: "cli-2",
    clientId: "CA-CLI-1002",
    name: "Karan Johar & Partners",
    mobile: "9123456781",
    email: "karan@kjpartners.in",
    pan: "AACKK5678D",
    aadhaar: "234567890123",
    gstin: "27AACKK5678D2Z4",
    tan: "MUMK23456C",
    businessType: "PARTNERSHIP",
    category: "GOLD",
    status: "ACTIVE",
    address: "802, Signature Towers, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    contactPerson: "Karan Johar",
    notes: "Partnership firm in Bollywood production consulting. High value quarterly TDS returns and ITR-5.",
    branchId: "br-mumbai",
    createdAt: "2024-02-15",
  },
  {
    id: "cli-3",
    clientId: "CA-CLI-1003",
    name: "Sharma Grocery Stores",
    mobile: "9123456782",
    email: "sharmagroceries@gmail.com",
    pan: "DOPPS7890M",
    aadhaar: "345678901234",
    gstin: "06DOPPS7890M1Z5",
    tan: "",
    businessType: "PROPRIETORSHIP",
    category: "RETAIL",
    status: "ACTIVE",
    address: "Shop 14, Main Market, Sector 15",
    city: "Faridabad",
    state: "Haryana",
    contactPerson: "Ram Lal Sharma",
    notes: "Proprietorship retail shop. Quarterly GST filing under composition scheme and basic individual ITR-4.",
    branchId: "br-delhi",
    createdAt: "2024-03-20",
  },
  {
    id: "cli-4",
    clientId: "CA-CLI-1004",
    name: "Devendra Patil (Individual)",
    mobile: "9123456783",
    email: "devpatil@yahoo.com",
    pan: "CKKPD8901A",
    aadhaar: "456789012345",
    gstin: "",
    tan: "",
    businessType: "INDIVIDUAL",
    category: "RETAIL",
    status: "ACTIVE",
    address: "Flat 402, Sai Heights, Kothrud",
    city: "Pune",
    state: "Maharashtra",
    contactPerson: "Devendra Patil",
    notes: "Individual salaried employee. Needs annual tax planning advisory, Form 16 upload, and ITR-1 filing.",
    branchId: "br-mumbai",
    createdAt: "2024-05-12",
  },
  {
    id: "cli-5",
    clientId: "CA-CLI-1005",
    name: "Zenith Bangalore Developers LLP",
    mobile: "9123456784",
    email: "accounts@zenithbuilders.com",
    pan: "AABZZ9876G",
    aadhaar: "",
    gstin: "29AABZZ9876G1ZA",
    tan: "BLRZ98765F",
    businessType: "LLP",
    category: "PLATINUM",
    status: "ACTIVE",
    address: "Block B, Tech Park Road, Outer Ring Road",
    city: "Bengaluru",
    state: "Karnataka",
    contactPerson: "Vikas Reddy (Partner)",
    notes: "Real estate LLP. Requires strict monthly compliance, TDS on property sales, and corporate audits.",
    branchId: "br-bangalore",
    createdAt: "2024-06-01",
  },
  {
    id: "cli-6",
    clientId: "CA-CLI-1006",
    name: "Global Export Logistics",
    mobile: "9123456785",
    email: "export@globallogistics.com",
    pan: "AABCG7721H",
    aadhaar: "",
    gstin: "27AABCG7721H1Z6",
    tan: "MUMG11928D",
    businessType: "PRIVATE_LIMITED",
    category: "GOLD",
    status: "ONBOARDING",
    address: "Cargo Complex, SEEPZ, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    contactPerson: "Sanjay Singhania",
    notes: "New client on-boarding. Needs GST registration amendments and IEC renewal.",
    branchId: "br-mumbai",
    createdAt: "2026-06-10",
  }
];

export const FILINGS: MockFiling[] = [
  // GST Filings
  { id: "fil-1", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", module: "GST", type: "GSTR-1", period: "May 2026", dueDate: "2026-06-11", filedDate: "2026-06-10", status: "FILED", referenceNo: "ARN-GST-992102", taxPaid: null },
  { id: "fil-2", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", module: "GST", type: "GSTR-3B", period: "May 2026", dueDate: "2026-06-20", filedDate: "2026-06-19", status: "FILED", referenceNo: "ARN-3B-881290", taxPaid: 450000 },
  { id: "fil-3", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", module: "GST", type: "GSTR-1", period: "June 2026", dueDate: "2026-07-11", filedDate: null, status: "PENDING", referenceNo: null, taxPaid: null },
  { id: "fil-4", clientId: "cli-2", clientName: "Karan Johar & Partners", module: "GST", type: "GSTR-3B", period: "May 2026", dueDate: "2026-06-20", filedDate: null, status: "OVERDUE", referenceNo: null, taxPaid: null },
  { id: "fil-5", clientId: "cli-3", clientName: "Sharma Grocery Stores", module: "GST", type: "GSTR-4", period: "Q1 FY 2026-27", dueDate: "2026-07-18", filedDate: null, status: "IN_PROGRESS", referenceNo: null, taxPaid: null },

  // ITR Filings
  { id: "fil-6", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", module: "ITR", type: "ITR-6", period: "AY 2026-27", dueDate: "2026-10-31", filedDate: null, status: "PENDING", referenceNo: null, taxPaid: null },
  { id: "fil-7", clientId: "cli-4", clientName: "Devendra Patil (Individual)", module: "ITR", type: "ITR-1", period: "AY 2026-27", dueDate: "2026-07-31", filedDate: null, status: "IN_PROGRESS", referenceNo: null, taxPaid: null },
  { id: "fil-8", clientId: "cli-2", clientName: "Karan Johar & Partners", module: "ITR", type: "ITR-5", period: "AY 2025-26", dueDate: "2025-10-31", filedDate: "2025-10-28", status: "FILED", referenceNo: "ACK-IT-5512019", taxPaid: 120000 },

  // TDS Filings
  { id: "fil-9", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", module: "TDS", type: "Form 24Q", period: "Q4 FY 2025-26", dueDate: "2026-05-31", filedDate: "2026-05-30", status: "FILED", referenceNo: "REC-TDS-51201", taxPaid: 75000 },
  { id: "fil-10", clientId: "cli-5", clientName: "Zenith Bangalore Developers LLP", module: "TDS", type: "Form 26Q", period: "Q1 FY 2026-27", dueDate: "2026-07-31", filedDate: null, status: "PENDING", referenceNo: null, taxPaid: null },

  // ROC Filings
  { id: "fil-11", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", module: "ROC", type: "AOC-4", period: "FY 2025-26", dueDate: "2026-10-30", filedDate: null, status: "PENDING", referenceNo: null, taxPaid: null },
  { id: "fil-12", clientId: "cli-5", clientName: "Zenith Bangalore Developers LLP", module: "ROC", type: "MGT-7", period: "FY 2025-26", dueDate: "2026-11-30", filedDate: null, status: "PENDING", referenceNo: null, taxPaid: null },
];

export const TASKS: MockTask[] = [
  {
    id: "tsk-1",
    title: "Monthly Bookkeeping and GST Reconciliation",
    description: "Reconcile purchase invoices from GSTR-2B with sales register for input tax credit claims.",
    clientId: "cli-1",
    clientName: "Acme Tech Solutions Private Limited",
    priority: "HIGH",
    status: "IN_PROGRESS",
    dueDate: "2026-06-25",
    assignedToId: "emp-4",
    assignedToName: "Priya Nair",
    createdById: "emp-1",
    createdAt: "2026-06-15",
    comments: [
      { id: "c1", employeeName: "Priya Nair", comment: "Waiting for client's bank statement for the last week of May.", createdAt: "2026-06-18" },
      { id: "c2", employeeName: "Deepak Yadav", comment: "Please call Siddharth directly. This is a platinum client, we cannot delay GSTR-3B.", createdAt: "2026-06-19" },
    ]
  },
  {
    id: "tsk-2",
    title: "Statutory Audit FY 2025-26",
    description: "Conduct site audit, verify cash in hand, bank balances, and asset registry matching schedules.",
    clientId: "cli-1",
    clientName: "Acme Tech Solutions Private Limited",
    priority: "CRITICAL",
    status: "PENDING",
    dueDate: "2026-09-30",
    assignedToId: "emp-2",
    assignedToName: "Ananya Sharma",
    createdById: "emp-1",
    createdAt: "2026-06-01",
    comments: []
  },
  {
    id: "tsk-3",
    title: "Form-16 Verification and ITR-1 Filing",
    description: "Cross check Form 16 details with AIS and TIS records for salaried tax refund.",
    clientId: "cli-4",
    clientName: "Devendra Patil (Individual)",
    priority: "LOW",
    status: "REVIEW",
    dueDate: "2026-07-31",
    assignedToId: "emp-3",
    assignedToName: "Amit Patel",
    createdById: "emp-1",
    createdAt: "2026-06-10",
    comments: [
      { id: "c3", employeeName: "Amit Patel", comment: "ITR drafted. Please review interest income mismatch in TIS.", createdAt: "2026-06-20" }
    ]
  },
  {
    id: "tsk-4",
    title: "TDS Return Filing - Q1",
    description: "Compile employee TDS salary records and prepare Form 24Q text file.",
    clientId: "cli-5",
    clientName: "Zenith Bangalore Developers LLP",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: "2026-07-31",
    assignedToId: "emp-5",
    assignedToName: "Vikram Singh",
    createdById: "emp-2",
    createdAt: "2026-06-20",
    comments: []
  },
  {
    id: "tsk-5",
    title: "Company Registration Amendment",
    description: "Update the registered office address on MCA portal by filing Form INC-22.",
    clientId: "cli-6",
    clientName: "Global Export Logistics",
    priority: "HIGH",
    status: "COMPLETED",
    dueDate: "2026-06-18",
    assignedToId: "emp-6",
    assignedToName: "Sunita Rao",
    createdById: "emp-2",
    createdAt: "2026-06-05",
    comments: [
      { id: "c4", employeeName: "Sunita Rao", comment: "MCA approval received. Chalan updated in documents folder.", createdAt: "2026-06-17" }
    ]
  }
];

export const INVOICES: MockInvoice[] = [
  { id: "inv-1", invoiceNo: "INV/2026/001", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", branchId: "br-delhi", dueDate: "2026-06-15", subTotal: 50000, cgst: 4500, sgst: 4500, igst: 0, total: 59000, status: "PAID", createdAt: "2026-06-01" },
  { id: "inv-2", invoiceNo: "INV/2026/002", clientId: "cli-2", clientName: "Karan Johar & Partners", branchId: "br-mumbai", dueDate: "2026-06-30", subTotal: 25000, cgst: 2250, sgst: 2250, igst: 0, total: 29500, status: "UNPAID", createdAt: "2026-06-10" },
  { id: "inv-3", invoiceNo: "INV/2026/003", clientId: "cli-5", clientName: "Zenith Bangalore Developers LLP", branchId: "br-bangalore", dueDate: "2026-06-25", subTotal: 80000, cgst: 0, sgst: 0, igst: 14400, total: 94400, status: "PARTIALLY_PAID", createdAt: "2026-06-05" },
  { id: "inv-4", invoiceNo: "INV/2026/004", clientId: "cli-3", clientName: "Sharma Grocery Stores", branchId: "br-delhi", dueDate: "2026-07-05", subTotal: 8000, cgst: 720, sgst: 720, igst: 0, total: 9440, status: "UNPAID", createdAt: "2026-06-20" },
  { id: "inv-5", invoiceNo: "INV/2026/005", clientId: "cli-4", clientName: "Devendra Patil (Individual)", branchId: "br-mumbai", dueDate: "2026-07-20", subTotal: 4000, cgst: 360, sgst: 360, igst: 0, total: 4720, status: "PAID", createdAt: "2026-06-18" },
];

export const PAYMENTS: MockPayment[] = [
  { id: "pay-1", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", invoiceId: "inv-1", receiptNo: "REC-2026-001", amount: 59000, paymentMode: "BANK_TRANSFER", referenceNo: "TXN992819827", paymentDate: "2026-06-12" },
  { id: "pay-2", clientId: "cli-5", clientName: "Zenith Bangalore Developers LLP", invoiceId: "inv-3", receiptNo: "REC-2026-002", amount: 50000, paymentMode: "UPI", referenceNo: "UPI119280918", paymentDate: "2026-06-18" },
  { id: "pay-3", clientId: "cli-4", clientName: "Devendra Patil (Individual)", invoiceId: "inv-5", receiptNo: "REC-2026-003", amount: 4720, paymentMode: "UPI", referenceNo: "UPI887210298", paymentDate: "2026-06-19" },
];

export const LEADS: MockLead[] = [
  { 
    id: "led-1", 
    name: "Suresh Prabhu", 
    companyName: "Prabhu Steels", 
    mobile: "9821033281", 
    email: "suresh@prabhusteels.com", 
    source: "Website", 
    stage: "NEW", 
    estimatedValue: 120000, 
    notes: "Needs complete advisory on steel export incentives and GST refund.", 
    branchId: "br-delhi", 
    createdAt: "2026-06-18",
    comments: [
      { id: "lc-1", employeeName: "Deepak Yadav", comment: "Needs callback by Monday. Follow up on export invoices.", createdAt: "2026-06-19" }
    ]
  },
  { 
    id: "led-2", 
    name: "Ria Sengupta", 
    companyName: "Kolkata Art House", 
    mobile: "9821033282", 
    email: "ria@kolkataarthouse.in", 
    source: "Referral", 
    stage: "PROPOSAL_SENT", 
    estimatedValue: 45000, 
    notes: "Sent proposal for annual bookkeeping and statutory audits. Waiting for partners sign off.", 
    branchId: "br-mumbai", 
    createdAt: "2026-06-12",
    comments: [
      { id: "lc-2", employeeName: "Ananya Sharma", comment: "Proposal compiled and shared via WhatsApp. Client acknowledged.", createdAt: "2026-06-13" }
    ]
  },
  { 
    id: "led-3", 
    name: "Dr. Alok Verma", 
    companyName: "Verma Dental Clinic", 
    mobile: "9821033283", 
    email: "drverma@dentcare.com", 
    source: "Cold Call", 
    stage: "NEGOTIATION", 
    estimatedValue: 35000, 
    notes: "Negotiating retainer fees. Offered a 10% discount on combined GST + ITR filings.", 
    branchId: "br-delhi", 
    createdAt: "2026-06-05",
    comments: [
      { id: "lc-3", employeeName: "Amit Patel", comment: "Asked for discount. We can offer 10% maximum to close this.", createdAt: "2026-06-06" }
    ]
  },
  { 
    id: "led-4", 
    name: "Meera Nair", 
    companyName: "Coimbatore Textiles", 
    mobile: "9821033284", 
    email: "meera@coimbatoretextiles.com", 
    source: "Website", 
    stage: "WON", 
    estimatedValue: 90000, 
    notes: "Agreed on terms. Client onboarded on June 10 as cli-6.", 
    branchId: "br-bangalore", 
    createdAt: "2026-06-01",
    comments: [
      { id: "lc-4", employeeName: "Deepak Yadav", comment: "Successfully onboarded. Created client record cli-6.", createdAt: "2026-06-10" }
    ]
  },
];

export const DOCUMENTS: MockDocument[] = [
  { id: "doc-1", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", name: "PAN_AcmeTech.pdf", fileUrl: "https://s3.aws.amazon.com/cafirm/cli-1/pan.pdf", fileSize: "1.2 MB", fileType: "pdf", category: "PAN", version: 1, isApproved: true, esignStatus: "COMPLETED", ocrData: { pan: "AABCA1234F", name: "Acme Tech Solutions Private Limited", docType: "PAN CARD" }, createdAt: "2026-01-11" },
  { id: "doc-2", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", name: "GST_Certificate_Acme.pdf", fileUrl: "https://s3.aws.amazon.com/cafirm/cli-1/gst.pdf", fileSize: "2.4 MB", fileType: "pdf", category: "GST_CERT", version: 1, isApproved: true, esignStatus: "COMPLETED", ocrData: { gstin: "06AABCA1234F1Z9", tradeName: "Acme Tech Solutions Private Limited", dateOfRegistration: "15/08/2021" }, createdAt: "2026-01-11" },
  { id: "doc-3", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", name: "BankStatement_May26.pdf", fileUrl: "https://s3.aws.amazon.com/cafirm/cli-1/bank_stmt.pdf", fileSize: "5.6 MB", fileType: "pdf", category: "BANK_STMT", version: 1, isApproved: false, esignStatus: "PENDING", ocrData: null, createdAt: "2026-06-05" },
  { id: "doc-4", clientId: "cli-4", clientName: "Devendra Patil (Individual)", name: "Form_16_Patil.pdf", fileUrl: "https://s3.aws.amazon.com/cafirm/cli-4/form16.pdf", fileSize: "3.1 MB", fileType: "pdf", category: "ITR_ACK", version: 1, isApproved: true, esignStatus: "COMPLETED", ocrData: { assessmentYear: "AY 2026-27", grossSalary: 1250000, employerName: "Infosys Limited", tdsDeducted: 85000 }, createdAt: "2026-06-19" },
  { id: "doc-5", clientId: "cli-5", clientName: "Zenith Bangalore Developers LLP", name: "Audit_Draft_FY25.pdf", fileUrl: "https://s3.aws.amazon.com/cafirm/cli-5/audit_draft.pdf", fileSize: "4.8 MB", fileType: "pdf", category: "AUDIT_REP", version: 2, isApproved: false, esignStatus: "SENT", ocrData: null, createdAt: "2026-06-15" },
];

export const NOTICES: MockNotice[] = [
  {
    id: "not-1",
    clientId: "cli-1",
    clientName: "Acme Tech Solutions Private Limited",
    issuingAuthority: "INCOME_TAX",
    noticeSection: "Section 143(1)",
    noticeNumber: "IT-SEC143-2026-9023",
    issueDate: "2026-06-01",
    dueDate: "2026-07-01",
    status: "OPEN",
    severity: "MEDIUM",
    escalatedTo: "Deepak Yadav",
    extractedNotes: "Notice of adjustment issued regarding interest income mismatch between ITR and Form 26AS. Demanding differential tax payment of ₹12,450."
  },
  {
    id: "not-2",
    clientId: "cli-2",
    clientName: "Karan Johar & Partners",
    issuingAuthority: "GST",
    noticeSection: "GST ASMT-10",
    noticeNumber: "GST-ASMT10-2026-5541",
    issueDate: "2026-06-15",
    dueDate: "2026-06-30",
    status: "ESCALATED",
    severity: "HIGH",
    escalatedTo: "Deepak Yadav",
    extractedNotes: "Notice of discrepancy in returns after scrutiny. Input Tax Credit claimed in GSTR-3B exceeds GSTR-2B by ₹1,42,000. Response required immediately to avoid penalty."
  },
  {
    id: "not-3",
    clientId: "cli-5",
    clientName: "Zenith Bangalore Developers LLP",
    issuingAuthority: "ROC",
    noticeSection: "Section 137 (Delay)",
    noticeNumber: "ROC-DEL-137-2026-3041",
    issueDate: "2026-05-10",
    dueDate: "2026-06-10",
    status: "CLOSED",
    severity: "LOW",
    escalatedTo: null,
    extractedNotes: "Late filing fee notification for annual financial returns AOC-4. Late fee of ₹2,000 paid. Status resolved."
  }
];

export const WHATSAPP_LOGS: MockWhatsAppLog[] = [
  { id: "wa-1", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", message: "Dear Siddharth, your GSTR-3B has been filed. Reference ARN: ARN-3B-881290. Tax paid: ₹4,50,000. Regards, CA Firm.", status: "READ", direction: "OUTGOING", timestamp: "2026-06-19 18:30" },
  { id: "wa-2", clientId: "cli-2", clientName: "Karan Johar & Partners", message: "Dear Client, your GST Filing for May 2026 is OVERDUE. Please send bank statements and purchase registry immediately to avoid late fees. Regards.", status: "DELIVERED", direction: "OUTGOING", timestamp: "2026-06-21 10:15" },
  { id: "wa-3", clientId: "cli-1", clientName: "Acme Tech Solutions Private Limited", message: "Got it, I will share the Bank Statements by tonight. Thanks!", status: "READ", direction: "INCOMING", timestamp: "2026-06-05 14:02" },
  { id: "wa-4", clientId: "cli-5", clientName: "Zenith Bangalore Developers LLP", message: "Outstanding Invoice alert! Invoice INV/2026/003 for amount ₹94,400 is partially unpaid. Balance: ₹44,400 due on 25-Jun-2026.", status: "SENT", direction: "OUTGOING", timestamp: "2026-06-21 11:30" },
];

export const ARTICLES: MockArticle[] = [
  { id: "art-1", title: "Guide to Input Tax Credit (ITC) Reconciliations", category: "GST", content: "Input Tax Credit (ITC) reconciliation matches the tax paid on purchases against invoices uploaded by suppliers in GSTR-1, which reflects in GSTR-2B. Under Section 16(4), any mismatch above 5% requires immediate discrepancy rectification.", tags: ["GST", "ITC", "GSTR-2B"], updatedAt: "2026-06-12" },
  { id: "art-2", title: "New Tax Regime vs Old Tax Regime comparison AY 2026-27", category: "INCOME_TAX", content: "Under AY 2026-27, the slab rates under the new tax regime have been revised. Standard deduction is increased to ₹75,000 for salaried employees. Old regime tax deductions under Section 80C, 80D remain unchanged.", tags: ["ITR", "Budget 2026", "Tax Rates"], updatedAt: "2026-05-20" },
  { id: "art-3", title: "Internal SOP: Document Verification Checklist", category: "INTERNAL_SOP", content: "When onboarding a new client, verify: 1. PAN card validity on Income Tax Portal, 2. GST Certificate match with MCA (if company), 3. Active Bank account validation through penny drop.", tags: ["SOP", "Onboarding", "Compliance"], updatedAt: "2026-04-18" },
];
