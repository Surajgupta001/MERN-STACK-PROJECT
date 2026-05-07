# ⚙️ QuickEMS - Employee Management System (Backend)

[![Node.js](https://img.shields.io/badge/Node.js-20-brightgreen.svg?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-black.svg?style=for-the-badge&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Inngest](https://img.shields.io/badge/Inngest-Background--Jobs-darkblue.svg?style=for-the-badge)](https://inngest.com)

Welcome to the backend of **QuickEMS**, a robust, highly secure, and feature-rich RESTful API built to power the Employee Management System. This backend handles user authentication, employee profiles, attendance logs, leave management, automated payroll generation, background job processing, and email communication.

---

## ✨ Features

### 🔐 Secure Authentication & Security
- **JWT Session Security:** Uses JSON Web Tokens for stateless, secure, and authenticated API requests.
- **Password Hashing:** Uses `bcrypt` to encrypt and store passwords with high salt rounds.
- **Route Authorization:** Restricts specific endpoints to authorized users (`ADMIN` vs `EMPLOYEE`).

### 💼 Employee & Profile Management
- **Profile REST API:** Fetch and update custom employee details and profiles securely.
- **Support for Admin Bios:** Dynamic storage of Admin bios within the user document, ensuring zero-configuration fallback.
- **Graceful Deactivation:** Soft deactivation of employee profiles without destroying critical historical records.

### 📅 Real-Time Attendance Logs
- **Check-In/Check-Out System:** Records precise check-in/out timestamps and computes active working hours.
- **Strict Enum Validation:** Eliminates casing bugs and validates day types (e.g. `Full Day`) smoothly.

### 🌴 Leave Workflow
- **Application Engine:** Submit, track, and process leave applications with full status histories.
- **Robust Routing:** Dynamically handles user roles during session authentication.

### 💵 Payslips & Payroll
- **Automatic Calculations:** Compiles basic salary, allowances, and deductions to compute net salary in real-time.
- **Fast Serialization:** Integrates lightweight `.lean()` Mongoose queries to return plain JavaScript objects, resolving data-spreading issues in PDF rendering.

### 🤖 Automated Background Jobs & Emailing
- **Inngest Server Integration:** Orchestrates reliable background jobs (Auto Check-Out, leave notifications, and cron reminders).
- **Nodemailer SMTP Relaying:** Connects with **Brevo (Sendinblue)** to dispatch professional HTML emails with full sender failover support.

---

## 🛠️ Detailed Tech Stack & System Architecture

### 🟢 Node.js & Express.js (Core Server)
- **Why Node.js?** Provides an asynchronous, event-driven JavaScript runtime that handles thousands of concurrent requests efficiently.
- **Why Express.js?** Acts as the routing framework to define modular and clean controllers, middlewares, and HTTP endpoint layers.

### 🟤 MongoDB & Mongoose (Database & Modelling)
- **Why MongoDB?** Non-relational document database perfectly suited for flexible employee documents, payroll histories, and dynamic check-in datasets.
- **Why Mongoose?** Provides rigorous schema enforcement, model relationships, and Mongoose query utilities (like `.populate()` and `.lean()`) to write cleaner, more performant database queries.

### 🔵 Inngest (Background Serverless Event Processing)
- **What does it do?** Manages long-running processes, delayed jobs (e.g. sleep 9 hours for auto check-out), and schedule-driven cron jobs (like attendance reminders) reliably outside the primary HTTP request-response cycle.

### ✉️ Nodemailer & Brevo (Mailing Engine)
- **What does it do?** Connects with Brevo's cloud SMTP relays over secure TLS ports to instantly deliver HTML emails to employees for check-out reminders or attendance notices.

---

## 📁 Detailed Directory Structure

```text
Backend/
├── config/                 # Configurations & Integrations
│   ├── database.js         # Mongoose connection setup to MongoDB Atlas
│   └── nodemailer.js       # Nodemailer SMTP transporter & Brevo relay configuration
├── constants/              # Global system constants and constant lists
├── controllers/            # Controller layer implementing Core Business Logic
│   ├── attendance.controllers.js  # Records check-in/out timestamps and active hours
│   ├── auth.controllers.js        # Handles secure logins, JWT creation, and password updates
│   ├── dashboard.controllers.js   # Calculates summary metrics for Admin/Employee portals
│   ├── employee.controllers.js    # Implements Employee CRUD operations
│   ├── leaveControllers.js        # Manages leave requests, approvals, and status tracking
│   ├── payslip.controllers.js     # Calculates net salary and serves issued payslips
│   └── profile.controllers.js     # Manages employee and admin bios/public profile data
├── inngest/                # Background event-driven functions
│   └── index.js            # Defines client and exports auto-checkout, reminders, and cron functions
├── middlewares/            # Custom Express Middlewares
│   └── auth.js             # Protects secure endpoints using JWT validation and role validation
├── models/                 # Database Schemas & Mongoose Models
│   ├── attendance.models.js  # Defines check-in/out logs schema with duration fields
│   ├── employee.models.js    # Defines full personal and corporate employee schemas
│   ├── leaveApplication.models.js # Defines structured leave status schemas
│   ├── payslips.models.js    # Defines corporate monthly financial schemas
│   └── user.models.js        # Defines login credential and role-based user schemas
├── routes/                 # Express Router configuration mapping paths to controllers
│   ├── attendance.routes.js  # Routes for check-in/checkout
│   ├── auth.routes.js        # Routes for login and credential modifications
│   ├── dashboard.routes.js   # Routes for company summary metrics
│   ├── employee.routes.js    # Routes for Employee CRUD
│   ├── leave.routes.js       # Routes for leave processing
│   ├── payslips.routes.js    # Routes for payroll generation
│   └── profile.routes.js     # Routes for settings profile operations
├── .env                    # System Environment secrets (PORT, DB URIs, SMTP credentials)
├── package.json            # Lists backend dependency versions and build/dev scripts
├── server.js               # Main application entry point initializing DB, middlewares, and routers
└── vercel.json             # Serverless deployment configuration for Vercel
```

---

## 📦 Installation & Local Setup

### 📋 Prerequisites
Ensure you have [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) installed, along with a running MongoDB database or a MongoDB Atlas connection string.

### 🚀 Getting Started

1. **Clone the repository and navigate to the Backend directory:**
   ```bash
   cd employee-management-system/Backend
   ```

2. **Install Dependencies:**
   Using Bun:
   ```bash
   bun install
   ```
   Or using npm:
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the `Backend` directory and define the following variables:
   ```env
   PORT=8080
   MONGODB_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   ADMIN_EMAIL=admin@example.com

   # INNGEST KEYS
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key

   # NODEMAILER (BREVO SMTP)
   SMTP_USER=your_brevo_smtp_user
   SMTP_PASS=your_brevo_smtp_password
   SENDER_EMAIL=surajgupta7070031833@gmail.com
   ```

4. **Run the Development Server:**
   Using Bun:
   ```bash
   bun run dev
   ```
   Or using npm:
   ```bash
   npm run start
   ```

---

## 🛡5 API Endpoints Summary

```text
/api/v1/auth        # Login, change password, check authentication
/api/v1/employees   # Employee CRUD operations (Admin only)
/api/v1/profile     # Get or update current user profile (Admin & Employee)
/api/v1/attendance  # Check-in, check-out, fetch historical attendance data
/api/v1/leave       # Submit leave, approve/reject requests, fetch leave status
/api/v1/payslips    # Create and fetch monthly employee payslips
/api/v1/dashboard   # Fetch summary metrics for Admin and Employee portals
```
