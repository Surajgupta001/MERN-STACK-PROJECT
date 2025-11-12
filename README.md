# MERN Stack Projects Collection

This monorepo contains multiple full‑stack web applications built with the MERN stack (MongoDB, Express.js, React, Node.js). Each project focuses on different real‑world features (auth, payments, background jobs, real‑time messaging, admin dashboards, etc.).

## 📋 Project Overview

> Tip: Each project has its own Backend and Frontend folders with a dedicated README. Use the Quickstart section below to run any app locally on Windows.

### 9) AI Resume Builder (`AI Resume Builder/`)

**Overview:** An AI‑powered resume creation app with a guided builder, live preview, multiple templates, and accent color theming. Users can enhance professional summaries and job descriptions via AI, upload a profile image with optional background removal, make resumes public/private, share a view‑only link, and print/download using the browser.

**Key Features:**

- Live resume builder with modular sections (personal info, summary, experience, education, projects, skills)
- Multiple templates with dynamic accent color
- AI enhancement for professional summary and job descriptions
- Image upload with optional background removal (ImageKit `e-bgremove`)
- Public/private visibility toggle and share link (`/view/:resumeId`)
- PDF printing via native browser print
- Upload existing PDF (client extracts text) → AI structured parsing → new resume

**Backend Technologies:**

- Node.js + Express, MongoDB + Mongoose
- JWT auth (jsonwebtoken), bcrypt
- Multer (file upload), ImageKit (image processing)
- OpenAI SDK configured for Gemini (chat.completions)
- dotenv, CORS

**Frontend Technologies:**

- React + Vite, React Router, Redux Toolkit
- Tailwind CSS, Lucide icons, react-hot-toast
- Axios, react-pdftotext (PDF → text)

Docs: `AI Resume Builder/Backend/README.md`, `AI Resume Builder/Frontend/README.md`

### 1) AI Powered Blog App (`AI Powered Blog App/`)

**Overview:** A comprehensive blogging platform that leverages AI technology to help users create engaging content. The application features an intuitive rich text editor, AI-powered content generation, automatic image optimization, and a modern, responsive design. Users can create, edit, and publish blog posts with AI assistance for content ideas and image management.

**Key Features:**

- AI-powered content generation and suggestions
- Rich text editing with Quill.js
- Image upload and optimization with ImageKit
- User authentication and profile management
- Markdown support and syntax highlighting
- Responsive design with smooth animations
- Comment system for user engagement

**Backend Technologies:**

- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **File Upload:** Multer for handling file uploads
- **AI Integration:** Google Generative AI (@google/genai)
- **Image Management:** ImageKit for image optimization and delivery
- **Other Libraries:** CORS, Dotenv, Nodemon (dev dependency)

**Frontend Technologies:**

- **Framework:** React 19 with Vite build tool
- **Styling:** TailwindCSS v4
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Rich Text Editor:** Quill.js
- **Markdown Parser:** Marked
- **Date Handling:** Moment.js
- **Animations:** Motion (Framer Motion)
- **Notifications:** React Hot Toast
- **Development Tools:** ESLint, Vite plugins

Docs: `AI Powered Blog App/Backend/Readme.md`, `AI Powered Blog App/Frontend/README.md`

### 2) AI Background Removal (`AI_BG_Removal/`)

**Overview:** An innovative web application that utilizes advanced AI algorithms to automatically remove backgrounds from images with professional precision. The platform offers a seamless user experience with secure payment processing, allowing users to purchase credits for image processing. Built with modern web technologies, it provides fast, reliable background removal services with user authentication and transaction management.

**Key Features:**

- AI-powered automatic background removal
- Secure payment integration with Razorpay
- User authentication and account management
- Credit-based usage system
- High-quality image processing
- Webhook integration for payment verification
- Responsive web interface
- File upload and download management

**Backend Technologies:**

- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **File Upload:** Multer for handling file uploads
- **Payment:** Razorpay integration
- **Webhooks:** Svix for webhook management
- **HTTP Client:** Axios
- **Other Libraries:** CORS, Dotenv, Form-data, Nodemon (dev dependency)

**Frontend Technologies:**

- **Framework:** React 19 with Vite build tool
- **Styling:** TailwindCSS v3
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Authentication:** Clerk (Clerk React)
- **Notifications:** React Toastify
- **Development Tools:** ESLint, PostCSS, Autoprefixer

Docs: `AI_BG_Removal/Backend/README.md` (if present) and `AI_BG_Removal/Frontend/README.md`

### 3) Chat App (`Chat App/`)

**Overview:** A real-time chat application built with modern web technologies that enables instant messaging between users. The platform features secure user authentication, cloud-based image storage, and responsive design for seamless communication across devices. It provides a complete chat experience with message history, user management, and real-time updates using WebSocket technology.

**Key Features:**

- Real-time messaging with Socket.io
- User authentication and registration
- Cloud image storage with Cloudinary
- Message history and chat persistence
- Responsive design for mobile and desktop
- User profile management
- Secure password hashing
- Instant message delivery

**Backend Technologies:**

- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** BcryptJS
- **Real-time Communication:** Socket.io
- **Image Storage:** Cloudinary
- **Other Libraries:** CORS, Dotenv, Nodemon (dev dependency)

**Frontend Technologies:**

- **Framework:** React 19 with Vite build tool
- **Styling:** TailwindCSS v4
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Real-time Communication:** Socket.io-client
- **Notifications:** React Hot Toast
- **Development Tools:** ESLint, Vite plugins

Docs: `Chat App/Backend/Readme.md`, `Chat App/Frontend/README.md`

### 4) Doctor Appointment Booking System (`Doctor Appointment Booking System/`)

**Overview:** A comprehensive healthcare management system designed to streamline the process of booking medical appointments. The platform connects patients with healthcare providers through an intuitive interface, featuring appointment scheduling, doctor profiles, payment processing, and administrative oversight. Built with scalability in mind, it includes separate admin and patient portals for efficient healthcare management.

**Key Features:**

- Patient appointment booking and management
- Doctor profile and availability management
- Secure payment processing with Razorpay
- Admin dashboard for system oversight
- User authentication and role-based access
- Appointment scheduling and reminders
- Medical record management
- Responsive design for all devices

**Backend Technologies:**

- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** Bcrypt
- **File Upload:** Multer for handling file uploads
- **Image Storage:** Cloudinary
- **Payment:** Razorpay integration
- **Validation:** Validator library
- **Code Formatting:** Prettier
- **Other Libraries:** CORS, Dotenv, Nodemon (dev dependency)

**Frontend Technologies:**

- **Framework:** React 19 with Vite build tool
- **Styling:** TailwindCSS v3
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Development Tools:** ESLint, PostCSS, Autoprefixer

**Admin Panel Technologies:**

- **Framework:** React 19 with Vite build tool
- **Styling:** TailwindCSS v3
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Development Tools:** ESLint, PostCSS, Autoprefixer

Docs: `Doctor Appointment Booking System/Backend/README.md`, `Doctor Appointment Booking System/Frontend/README.md`, `Doctor Appointment Booking System/Admin/README.md`

### 5) E-commerce Website (`E-commerce Website/`)

**Overview:** A full-featured e-commerce platform that provides a complete online shopping experience with product management, shopping cart functionality, secure payment processing, and comprehensive admin dashboard. The platform supports multiple payment gateways, user authentication, product categorization, order management, and inventory tracking. Built with modern web technologies, it offers a seamless shopping experience for customers and powerful management tools for administrators.

**Key Features:**

- Product catalog and category management
- Shopping cart and checkout system
- Multiple payment gateway integration (Razorpay, Stripe)
- User authentication and account management
- Admin dashboard for product and order management
- Order tracking and history
- Product reviews and ratings
- Inventory management system
- Responsive design for mobile and desktop

**Backend Technologies:**

- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** Bcrypt
- **File Upload:** Multer for handling file uploads
- **Image Storage:** Cloudinary
- **Payment:** Razorpay and Stripe integration
- **Validation:** Validator library
- **Code Formatting:** Prettier
- **Other Libraries:** CORS, Dotenv, Nodemon (dev dependency)

**Frontend Technologies:**

- **Framework:** React 19 with Vite build tool
- **Styling:** TailwindCSS v4
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Development Tools:** ESLint, Vite plugins

**Admin Panel Technologies:**

- **Framework:** React 19 with Vite build tool
- **Styling:** TailwindCSS v4
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Development Tools:** ESLint, Vite plugins

Docs: `E-commerce Website/Backend/README.md`, `E-commerce Website/Frontend/README.md`, `E-commerce Website/Admin/README.md`

### 6) Car Rental Booking Platform (`Car Rental Booking Platform/`)

**Overview:** A modern car rental platform enabling users to search cars by location and date range, view car details, and make bookings. Owners can add and manage cars, toggle availability, and process bookings by changing status (pending, confirmed, canceled). The system features robust authentication, image uploads via CDN, and availability checks to prevent overlapping bookings.

**Key Features:**

- Search cars by location with date-range availability
- Car details with pricing computed by `pricePerDay`
- Secure booking flow with conflict prevention
- Owner dashboard: add, list, delete cars; manage availability
- Booking management: view bookings and update status
- JWT-based auth with Bearer headers
- Image uploads using memory storage to CDN
- Responsive UI and helpful notifications

**Backend Technologies:**

- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **File Upload:** Multer (memoryStorage) + CDN (ImageKit)
- **Validation/Utilities:** Date range overlap checks
- **Other Libraries:** CORS, Dotenv, Nodemon

**Frontend Technologies:**

- **Framework:** React 19 with Vite build tool
- **Styling:** TailwindCSS v4
- **Routing:** React Router DOM
- **HTTP Client:** Axios with global Bearer token header
- **Notifications:** React Hot Toast
- **State:** Context API for auth + axios instance

Docs: `Car Rental Booking Platform/Backend/Readme.md`, `Car Rental Booking Platform/Frontend/README.md`

### 7) AI SaaS App (`AI SaaS App/`)

Foundational full‑stack app scaffolding for an AI‑driven SaaS. Includes typical MERN patterns with modern React, and separate Backend/Frontend workspaces.

Docs: `AI SaaS App/Backend/README.md`, `AI SaaS App/Frontend/README.md`

### 8) Social Media App (`social-media-app/`)

A modern social app featuring profiles, connections, feeds, and real‑time messaging. Real‑time updates are implemented using Server‑Sent Events (SSE), with robust authentication flows and a clean UI.

Docs: See project folders under `social-media-app/` (Backend and Frontend READMEs if present).

## 🚀 Common Technologies Across Projects

### Backend (Shared Across Many Projects)

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** CORS, Dotenv for environment variables
- **Development:** Nodemon for auto-restart

### Frontend (Shared Across Many Projects)

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS (v3/v4)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast / React Toastify
- **Development:** ESLint, Vite plugins

## 📁 Project Structure

```bash
MERN STACK PROJECT/
├── AI Powered Blog App/
│   ├── Backend/
│   └── Frontend/
├── AI SaaS App/
│   ├── Backend/
│   └── Frontend/
├── AI_BG_Removal/
│   ├── Backend/
│   └── Frontend/
├── Chat App/
│   ├── Backend/
│   └── Frontend/
├── Doctor Appointment Booking System/
│   ├── Admin/
│   ├── Backend/
│   └── Frontend/
├── Car Rental Booking Platform/
│   ├── Backend/
│   └── Frontend/
├── E-commerce Website/
    ├── Admin/
    ├── Backend/
    └── Frontend/
└── social-media-app/
    ├── Backend/
    └── Frontend/
```

## 🛠️ Getting Started

Each project contains its own README.md with detailed setup instructions. On Windows (PowerShell), the general flow is:

1. Navigate to a project (for example, the Car Rental app Backend):

   ```powershell
   cd "Car Rental Booking Platform/Backend"
   ```

2. Install dependencies (repeat in both Backend and Frontend):

   ```powershell
   npm install
   ```

3. Configure environment variables by creating a `.env` file in the Backend (and Frontend if required). See the project's own README for the exact keys (e.g., `MONGODB_URI`, JWT or Clerk keys, Cloudinary/ImageKit, Razorpay/Stripe, etc.).

4. Start the Backend (common scripts):

   ```powershell
   npm run dev   # or: npm run server
   ```

5. In another terminal, start the Frontend:

   ```powershell
   cd "../Frontend"; npm install; npm run dev
   ```

6. Open the local URLs printed by the servers (typically Vite at [http://localhost:5173](http://localhost:5173) and API at [http://localhost:5000](http://localhost:5000) or similar).

## 🤝 Contributing

We welcome contributions from the community! Here's how you can contribute to this MERN Stack Projects Collection:

### 🚀 Ways to Contribute

- **🐛 Report Bugs:** Found a bug? Open an issue with detailed information
- **💡 Suggest Features:** Have an idea for a new feature? We'd love to hear it
- **🔧 Submit Pull Requests:** Help improve the codebase
- **📖 Improve Documentation:** Help make our documentation better
- **🧪 Add Tests:** Help ensure code quality with tests

### 📋 Development Process

1. **Fork the Repository**

   ```bash
   git clone https://github.com/Surajgupta001/MERN-STACK-PROJECT.git
   cd MERN-STACK-PROJECT
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set Up Development Environment**
   - Navigate to the specific project you want to work on
   - Install dependencies: `npm install`
   - Set up environment variables (check project-specific README)
   - Start development servers

4. **Make Your Changes**
   - Follow the existing code style and conventions
   - Write clear, concise commit messages
   - Test your changes thoroughly
   - Update documentation if needed

5. **Submit a Pull Request**
   - Push your changes to your fork
   - Create a Pull Request with a clear description
   - Reference any related issues

### 📝 Code Standards

- **JavaScript/Node.js:** Follow ESLint configuration
- **React:** Use functional components with hooks
- **Styling:** Use TailwindCSS classes consistently
- **Commits:** Use conventional commit format
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting
  - `refactor:` for code restructuring

### 🐛 Reporting Issues

When reporting bugs, please include:

- **Title:** Clear, descriptive title
- **Description:** Detailed description of the issue
- **Steps to Reproduce:** Step-by-step instructions
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happens
- **Environment:** Browser, OS, Node.js version
- **Screenshots:** If applicable

### 📊 Pull Request Guidelines

- **Keep PRs Small:** Focus on one feature or fix per PR
- **Descriptive Titles:** Use clear, descriptive PR titles
- **Testing:** Ensure all tests pass
- **Documentation:** Update README if needed
- **Screenshots:** Include before/after screenshots for UI changes

### 🎯 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a positive community
- Follow GitHub's Community Guidelines

### 📞 Getting Help

- **Issues:** Use GitHub Issues for bugs and feature requests
- **Discussions:** Use GitHub Discussions for general questions
- **Email:** Contact the maintainers directly for sensitive matters

Thank you for contributing to MERN Stack Projects Collection! 🎉

## 📝 Notes

- All projects use ES modules (`"type": "module"`)
- Modern React 19 with latest features
- Consistent project structure across all applications
- Mix of TailwindCSS v3 and v4 depending on project timeline
- Various payment integrations (Razorpay, Stripe)
- Real-time features implemented via Socket.io or Server‑Sent Events (SSE), depending on the app
- AI integrations (for example, Google Generative AI) where applicable
- Authentication solutions (JWT or Clerk) depending on the app

---

**Author:** Suraj Gupta
**Repository:** MERN-STACK-PROJECT
**Date:** October 15, 2025
