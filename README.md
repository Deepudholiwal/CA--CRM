# 🏢 AethelGard - Enterprise CA Firm CRM & Compliance SaaS

**AethelGard** is a premium, enterprise-grade SaaS and CRM platform built specifically for Chartered Accountants, Tax Consultants, Accounting Firms, GST Practitioners, and Financial Advisors. Named **Deepak Yadav & Associates**, it is engineered to streamline practice operations, manage corporate and retail compliance cycles, and optimize client relationships.

---

## ✨ Features & Architecture

### 📊 Practice Dashboards & Analytics
- **Multi-Role Interfaces**: Complete role-based dashboards tailored for **Super Admin, CA Partner, Manager, Accountant, Tax Consultant, Client Support**, and a self-service **Client Portal** for taxpayers.
- **Practice Performance KPIs**: Track total revenue billing streams, compliance completion rates, open high-risk notices, and team biometrics attendance summaries.
- **Dynamic Charting**: Interactive visualizations built with **Recharts** detailing client demographics, filing progress, and monthly billing/revenue collections.

### 🏢 Client CRM & Timeline Log
- **360° Client Profile**: Centralized view containing client registration info, bank statements, and tax files.
- **Interactive Timelines**: Real-time log tracking emails, calls, WhatsApp alerts, filings, and document uploads in chronological order.
- **Branch Management**: Multi-branch filters (e.g., Delhi, Mumbai, Bangalore) to manage clients, employees, and revenues per branch office.

### ⚡ Compliance Filings Registry
- **GST filings Console**: Track GSTR-1, GSTR-3B progress, log filing ARNs, track government payment status, and send WhatsApp reminder drafts.
- **Income Tax (ITR)**: Monitor ITR-1 to ITR-6 compliance statuses. Built-in **Form-16 PDF Scanner** simulation to extract employer names, gross salaries, and TDS deductions.
- **TDS & ROC Filing Workspaces**: Manage monthly TDS/TCS forms, quarterly tax schedules, and ROC board resolutions.

### 🤖 AI-Powered Assistants
- **AI Notice Analyzer**: Simulates extracting critical issues from income tax (e.g., Section 143(1)) and GST notices, generating immediate structured risk ratings, response recommendations, and drafting response letters.
- **AI Tax Assistant**: Interactive tax assistant for immediate legal and tax code inquiries.

### 📝 Project Collaboration & Billing
- **Kanban Tasks Board**: Drag-and-drop or push-button workflows for assigning work, managing statuses, and adding follow-up logs.
- **Billing & Invoices**: CGST/SGST professional fee invoice compiler, checkout pages, and receipts tracker.
- **Document Vault**: Cloud-folders structured directory with support for real file uploading and digital e-signature tracking.

---

## 🛠️ Technology Stack

- **Core**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styles**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database Schema**: [Prisma ORM](https://www.prisma.io/) (28 PostgreSQL schemas)
- **Local Database Engine**: Reactive React Context backing data updates directly to browser `localStorage` for immediate offline usability.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Deepudholiwal/CA--CRM.git
   cd CA--CRM
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Spin up Development Server**:
   ```bash
   npm run dev
   ```

4. **Verify Application**:
   - Open [http://localhost:3000](http://localhost:3000) in your web browser.
   - Switch user roles in the top-right header (dropdown containing all 7 roles) to experience the role-based dashboard screens and page locks.
   - Click the "Client Portal" link at the bottom of the sidebar to view the taxpayer self-service experience.

---

## 📂 Project Directory Structure

```text
├── prisma/
│   └── schema.prisma         # Complete PostgreSQL schema (28 tables)
├── src/
│   ├── app/
│   │   ├── api/              # Auth, Client, AI Notice, and WhatsApp API route templates
│   │   ├── audit/            # Audit workspace schedules
│   │   ├── billing/          # Invoices logs and payments checklists
│   │   ├── calendar/         # Practice Compliance calendar
│   │   ├── client-portal/    # Self-service taxpayer workspace
│   │   ├── clients/          # Client profiles & relationship timeline
│   │   ├── dashboard/        # Practice analytics dashboard
│   │   ├── employees/        # Attendance tracker & leave management
│   │   ├── gst/              # GSTR filing console
│   │   ├── ITR/              # Income tax OCR scanner module
│   │   ├── tasks/            # Kanban tasks board with comments
│   │   └── globals.css       # Contrast variables & custom scrollbar styles
│   ├── components/
│   │   ├── ai/               # AI notice analyzer & chatbot widgets
│   │   ├── layout/           # Sidebar, shell, and header components
│   │   └── ui/               # Reusable premium Cards, Badges, Modals, and Tables
│   ├── context/
│   │   ├── DatabaseContext.tsx # Central LocalStorage database provider (clients, tasks, leads, etc.)
│   │   └── ThemeContext.tsx    # HSL dark/light modes toggle context
│   └── utils/
│       └── dummyData.ts      # Structured mock datasets and models
```

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
