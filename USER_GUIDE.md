# User & Operations Manual: AethelGard CA CRM & Compliance platform

Welcome to the **AethelGard Practice Management & Compliance SaaS Portal**. This portal is designed to help Chartered Accountants, Tax Consultants, Corporate Advisors, and Financial Practitioners manage their client databases, track filing deadlines, coordinate task checklists, handle billing invoices, and automate client communications.

To make this software immediately usable out-of-the-box by any firm or employee without complex database installations, the system uses a **stateful LocalStorage Database Engine**. Any clients, tasks, invoices, or WhatsApp alerts you add are saved locally in your browser session and survive page reloads!

---

## Table of Contents
1. [System Startup & Basic Setup](#1-system-startup--basic-setup)
2. [Practice Dashboard & KPI Overview](#2-practice-dashboard--kpi-overview)
3. [User Roles & Permissions (RBAC)](#3-user-roles--permissions-rbac)
4. [Client CRM & Lead Pipeline](#4-client-crm--lead-pipeline)
5. [Tax Compliance Chambers (GST, ITR, TDS, ROC)](#5-tax-compliance-chambers-gst-itr-tds-roc)
6. [Task Management & Kanban Boards](#6-task-management--kanban-boards)
7. [Document Vault & AI OCR Tools](#7-document-vault--ai-ocr-tools)
8. [Billing, GST Invoices & Receipts](#8-billing-gst-invoices--receipts)
9. [SaaS Settings & Branch Management](#9-saas-settings--branch-management)
10. [Taxpayer Self-Service Portal](#10-taxpayer-self-service-portal)

---

## 1. System Startup & Basic Setup

To launch the portal on your computer:
1. Open your terminal and change directory to the project folder:
   ```bash
   cd C:\Users\DELL\.gemini\antigravity\scratch\ca-firm-crm
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open your web browser and navigate to: **`http://localhost:3000`**

---

## 2. Practice Dashboard & KPI Overview

Once logged in, the first screen you see is the **Practice Dashboard**. This screen acts as the operational nerve center of your firm:
- **KPI Cards**: See total clients, pending GST returns, pending corporate ITR filings, monthly collected revenue, and your firm's overall Compliance Score.
- **Revenue Analytics**: Recharts-powered graphs show generated invoices (blue) against actual collections (green) over the last 6 months.
- **Filing Division**: A pie chart breaking down tax filings that are Filed, Pending, In Progress, or Overdue.
- **Scrutiny Notices**: Displays active notices requiring responses, color-coded by severity (High, Medium, Low) and sorted by due date.
- **Staff Performance**: Displays employee productivity metrics and task loads.
- **AI Notice Scanner**: Quick-access tool to scan official tax notices.

---

## 3. User Roles & Permissions (RBAC)

The system supports **7 default user roles**. In the top header bar, you will find a dropdown menu labeled with the active role (e.g., **CA Partner**). Click this dropdown to switch roles instantly and see how the UI adapt:

| Role | Access Level & Capabilities |
| :--- | :--- |
| **Super Admin** | Full access. View all regional branches, modify firm billing billing plans, and edit settings. |
| **CA Partner** | Full operational access. Approve audit reports, sign off on tax returns, and edit settings. |
| **Manager** | Task allocations, employee tracking, client updates, and drafting invoice bills. |
| **Accountant** | Generate GST invoices, log UPI payment collections, reconcile cash schedules. |
| **Tax Consultant** | Prepare GSTR returns, review ITR schedules, draft tax notice clarifications replies. |
| **Data Entry** | basic view. Upload bank statements and KYC files to the secure vault. |
| **Client** | Portal access only. Download reports, upload files, pay invoices, and review filings. |

---

## 4. Client CRM & Lead Pipeline

Navigate to the **Clients & CRM** tab in the sidebar. This workspace manages client acquisition and onboarding:
- **Active Clients Tab**: Shows your entire client directory.
  - *Add Client*: Click "Add Client" to enter name, PAN, Aadhaar, GSTIN, business type, and branch office.
  - *Relationship Timeline Profile*: Click the **eye icon** next to any client to open their Profile. This drawer consolidates their GST filings history, payment receipts, uploaded files, WhatsApp logs, and active notices into a single timeline.
- **Leads & Pipeline Tab**: A Kanban board showing sales inquiries (New, Proposal Sent, Negotiation, Closed Won, Closed Lost).
  - *Create Lead*: Click "Add Inquiry" to log a new prospect.
  - *Generate Proposal*: Click "Proposal" on a lead card to enter monthly GST, annual ITR, and audit fees. Click "Compile Quotation" to automatically generate a formal PDF quotation letter.
  - *Onboarding*: Move a lead card to "Closed Won" to automatically trigger the onboarding workflow, create setup tasks, and send a welcome WhatsApp template.

---

## 5. Tax Compliance Chambers (GST, ITR, TDS, ROC)

Each compliance department has its own dedicated filing room in the sidebar:
- **GST Filings**:
  - Displays returns (GSTR-1, GSTR-3B, GSTR-9) due dates and ARN references.
  - Click "File GSTR" on any pending return to enter the ARN (Application Reference Number) and Challan tax paid to mark it as FILED.
  - Click "Remind" to dispatch a template WhatsApp due reminder to the client.
- **Income Tax (ITR)**:
  - Tracks AY 2026-27 filings (ITR-1 to ITR-6).
  - Use the "AI OCR Form 16 upload" button to select a mock salary PDF. The AI scanner extracts gross salaries, employer names, and TDS deductions to map them directly to return forms.
- **TDS Compliance**:
  - Tracks quarterly Form 24Q (salary) and 26Q (non-salary fees).
  - Records TAN registries and logs Challan 281 deposits (BSR bank codes, Challan numbers).
- **ROC Workspace**:
  - Tracks annual company filings (AOC-4 financial reports, MGT-7 annual returns).
  - Logs active DIN codes, Director profiles, and MCA Board Meeting compliant intervals.

---

## 6. Task Management & Kanban Boards

Click **Tasks & Kanban** in the sidebar to organize daily work:
- **Kanban Board**: Drag tasks or click transition status buttons to move work from *Pending* ➔ *In Progress* ➔ *Review* ➔ *Completed*.
- **Add Task**: Click "Add Task" to enter task title, description, target client, priority (Critical, High, Medium, Low), assignee staff, and due date.
- **Task Workspace Drawer**: Click any task card to open the workspace. Here you can:
  - Add checklist items.
  - Transition task stages.
  - Discuss files with team members by posting messages in the **Task Collaboration & Comments** feed.

---

## 7. Document Vault & AI OCR Tools

Navigate to **Document Vault** to manage digital records:
- **Vault Directory**: Files are organized into virtual folders (PAN, Aadhaar, GST Certificates, Bank Statements, Audit Reports).
- **File Uploader**: Select a client, map the category folder, and type a filename. Click "Upload File" to save it securely.
- **Secure File Properties Drawer**: Click any document row to open its properties drawer:
  - *Approve*: Click "Approve Schedule" to verify audit schedules.
  - *E-Signatures*: Click "Sign as Partner" or "Send Client E-Sign" to request digital signatures.
  - *AI OCR*: Click "Run AI OCR Reader" to automatically parse document values (e.g., extracting registration dates from GST certificates).

---

## 8. Billing, GST Invoices & Receipts

Click **Billing & Invoices** to manage practice accounts:
- **Invoice Register**: Lists all corporate bills with CGST/SGST/IGST taxes automatically calculated.
- **Generate Invoice**: Click "New Invoice" to choose a client, enter the fee subtotal, set a due date, and write billing notes. 18% GST (9% CGST + 9% SGST) is computed automatically.
- **Log Payment Receipt**: Click "Log Payment" on an unpaid invoice. Enter the collection amount, mode (UPI, bank transfer, cheque, cash), and reference transaction ID to mark the invoice as PAID and issue a receipt coupon.

---

## 9. SaaS Settings & Branch Management

Navigate to **Settings** in the sidebar (accessible by Partners/Admins):
- **Firm Profile**: Edit your firm's legal name and update your HSL branding color themes (Indigo, Emerald, Sky).
- **Sub-Branches**: Review regional hubs (Delhi NCR, Mumbai Corporate, Bangalore Tech) with their address locations and GSTINs.
- **Role Permissions (RBAC)**: View the live scopes mapping permissions across all roles.
- **Automations**: Toggle auto WhatsApp due notifications and Multi-Factor Authentication checks.

---

## 10. Taxpayer Self-Service Portal

Click **Client Portal** at the bottom of the sidebar to simulate the client experience:
- **Client Overview**: The client (e.g., Siddharth Mehta from Acme Tech Solutions) sees their compliance score and outstanding balances.
- **Filing status**: Checks filed dates and ARN references for their GSTR and ITR returns.
- **Vault Folders**: Downloads certificates or uploads bank statements for the CA firm.
- **Invoices & Payments**: Lists unpaid bills. Click **"Pay Now"** to open a simulated payment gateway, choose UPI, and enter a reference code to settle the bill.
- **Message Advisor**: Logs support questions directly in the consultant's WhatsApp logs database.
