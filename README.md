# Campus-pay

> **Tagline:** Know Before You Pay. Pay Without Confusion.

CampusPay is a modern, student-friendly web application designed to solve payment confusion at campus canteens, juice corners, and stationery shops. It gives students immediate clarity on accepted payment methods (UPI vs Cash), authorized QR codes, step-by-step payment verification checklists, and a searchable troubleshooting guide for pending, deducted, or failed transactions.

> ⚠️ **Important Disclaimer:** CampusPay is an **information and guidance platform**, *not* a payment gateway or banking intermediary. It does not process or verify monetary transactions, nor does it ask for UPI PINs, passwords, or sensitive financial data.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Information Architecture](#information-architecture)
5. [Folder Structure](#folder-structure)
6. [Local Installation & Setup](#local-installation--setup)
7. [Environment Variables](#environment-variables)
8. [Running the Application](#running-the-application)
9. [MongoDB Setup & Database Seeding](#mongodb-setup--database-seeding)
10. [Zero-Config Demo Mode](#zero-config-demo-mode)
11. [Testing User Flows](#testing-user-flows)
12. [Deployment Guide (Vercel & Render)](#deployment-guide-vercel--render)
13. [Limitations & Future Improvements](#limitations--future-improvements)

---

## Problem Statement

Students on campus frequently encounter payment friction at busy stalls:
- **Unclear payment acceptance:** Joining a long queue only to discover the stall does not accept cash, or has an offline UPI scanner.
- **QR code confusion:** Stalls often have faded, damaged, or unverified printed QR codes pinned on counters.
- **Network dropouts:** Weak connectivity during peak hours leads to freezing payment apps and duplicate payment attempts.
- **Transaction anxiety:** When an app displays "Payment Pending" or money is deducted without immediate merchant acknowledgement, students don't know whether to pay again or wait.

CampusPay eliminates this friction by serving as a single source of truth for payment methods, authorized stall QR codes, and actionable payment troubleshooting.

---

## Key Features

### 1. Campus Stall Discovery & Directory
- Real-time search by stall name, category, or item keywords.
- Dynamic filters: **All Stalls**, **UPI Available**, **Cash Accepted**, and **Currently Open**.
- Rich stall cards displaying opening status indicators, campus locations, accepted badges, and direct links to payment guidance.

### 2. Stall Detail & Authorized QR Modal
- Detailed view with stall timings, campus location, and stall-specific payment instructions.
- Dedicated **View UPI QR Code** modal displaying authorized stall QR imagery or a clearly labelled demo placeholder.
- Prominent 4-step safety advisory before initiating payment.

### 3. Step-by-Step Payment Guidance
- Visual 6-step checklist guiding students from queueing to verifying payment success inside their personal UPI app.
- Clear disclaimer reminding students that CampusPay never collects UPI PINs or processes payments directly.

### 4. Interactive Troubleshooting & FAQ Center
- Searchable issue resolver covering the top 5 campus payment scenarios:
  1. **Payment Pending**
  2. **Money Deducted but Merchant Not Received**
  3. **QR Code Not Working**
  4. **Slow Internet Connection**
  5. **Payment Failed**
- Instant category switching and smooth animated expandable accordions.

### 5. Protected Stall Owner Dashboard
- JWT-authenticated portal for verified campus stall owners.
- Real-time updates for:
  - Stall Name, Category, and Campus Location
  - Operating status toggle (Open / Closed)
  - Payment method toggles (Accepts UPI / Accepts Cash)
  - Backup payment instructions
- Works with MongoDB in production and includes a seamless **One-Click Demo Mode** for testing without database setup.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, React Router v7 |
| **Backend** | Node.js, Express.js, Multer (file uploads), CORS, dotenv |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs (12 rounds) |
| **Database** | MongoDB with Mongoose ODM |
| **Deployment Targets** | Vercel (Frontend), Render (Backend), MongoDB Atlas |

---

## Information Architecture

```
CampusPay
├── Home (/)
│   ├── Hero Search & Direct CTAs
│   ├── Quick Stat Strip
│   ├── Featured Campus Stalls
│   └── 3-Step "How It Works" Flow
├── Explore Stalls (/stalls)
│   ├── Search Bar (Name / Category)
│   ├── Filter Chips (All, UPI, Cash, Open)
│   └── Stall Detail View (/stalls/:id)
│       ├── Payment Methods & Timings
│       ├── View UPI QR Code (Modal)
│       ├── Stall Backup Payment Notes
│       └── Pre-payment Safety Checklist
├── Payment Guide (/payment-guidance)
│   ├── 6-Step Visual Payment Checklist
│   └── Platform Safety & Non-Gateway Disclaimer
├── Payment Help (/payment-help)
│   ├── Searchable Troubleshooting FAQs
│   └── Category Filters (Pending, Deducted, QR, Internet, Failed)
├── About (/about)
│   ├── Mission & Problem Statement
│   ├── What CampusPay Can & Cannot Do
│   └── Impact for Students & Stall Owners
└── Stall Owner Dashboard (/dashboard)
    ├── Login (/dashboard/login) & Register (/dashboard/register)
    ├── Stall Profile Management
    ├── Live Operating Status Toggles
    └── In-Memory / Database Synchronization
```

---

## Folder Structure

```
CampusPay/
├── client/                      # Frontend Application (React + Vite)
│   ├── public/                  # Favicons & static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, Footer, StallCard, QRModal, FAQAccordion)
│   │   ├── context/             # AuthContext (JWT & Demo session management)
│   │   ├── data/                # Demo stalls & structured FAQ dataset
│   │   ├── layouts/             # MainLayout with responsive header & footer
│   │   ├── pages/               # Route pages (Home, Stalls, StallDetail, Guide, Help, About, Dashboard, Login, Register)
│   │   ├── services/            # Axios API client with automatic Bearer token injection
│   │   ├── App.jsx              # Client router with protected private routes
│   │   ├── index.css            # Custom CSS design system, typography & micro-interactions
│   │   └── main.jsx             # React DOM root entry point
│   ├── .env.example             # Frontend environment template
│   ├── index.html               # Main HTML document with SEO meta tags
│   ├── package.json             # Frontend dependencies & build scripts
│   └── vite.config.js           # Vite dev server configuration & API proxy
├── server/                      # Backend REST API (Node.js + Express)
│   ├── config/                  # Mongoose MongoDB connection with graceful offline handling
│   ├── controllers/             # Auth & Stall business logic
│   ├── data/                    # Fallback dataset for zero-config demonstration
│   ├── middleware/              # JWT authorization middleware
│   ├── models/                  # Mongoose schemas (User, Stall)
│   ├── routes/                  # Express API routes (auth, stalls, owner)
│   ├── uploads/                 # Storage for uploaded authorized QR codes
│   ├── .env.example             # Backend environment template
│   ├── app.js                   # Express server initialization & centralized error handling
│   ├── package.json             # Backend dependencies & scripts
│   └── seed.js                  # Database seeder script
├── .gitignore                   # Git ignore rules for node_modules, .env, and uploads
└── README.md                    # Comprehensive documentation
```

---

## Local Installation & Setup

### Prerequisites
- Node.js (v18.x or later recommended)
- npm (v9.x or later)
- MongoDB (Optional: required only for database persistence; the application runs out-of-the-box in demo mode without MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CampusPay.git
cd CampusPay
```

### 2. Install Dependencies

Install backend dependencies:
```bash
cd server
npm install
```

Install frontend dependencies:
```bash
cd ../client
npm install
```

---

## Environment Variables

### Backend (`server/.env`)
Create a `.env` file in the `server` directory by copying `.env.example`:
```bash
cd server
cp .env.example .env
```
Fill in the configuration parameters:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campuspay?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_at_least_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
Create a `.env` file in the `client` directory by copying `.env.example`:
```bash
cd client
cp .env.example .env
```
Configuration:
```env
# In development, leave empty to utilize Vite's reverse proxy (/api -> http://localhost:5000)
# In production, set to your backend deployment URL:
# VITE_API_URL=https://campuspay-api.onrender.com/api
```

---

## Running the Application

### Option A: Run Backend Server
From the `server` directory:
```bash
cd server
npm start
# Server starts on http://localhost:5000
```
For auto-reloading during development:
```bash
npm run dev
```

### Option B: Run Frontend Dev Server
From the `client` directory in a separate terminal:
```bash
cd client
npm run dev
# Application starts on http://localhost:5173
```

### Production Build
To create an optimized production build of the frontend:
```bash
cd client
npm run build
```

---

## MongoDB Setup & Database Seeding

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) or start a local MongoDB instance (`mongod`).
2. Add your connection string to `server/.env` under `MONGODB_URI`.
3. Run the database seed script to automatically create test stall owners and campus stalls:
```bash
cd server
npm run seed
```
This populates:
- **Canteen Manager** (`canteen@campus.edu` / `password123`)
- **Juice Bar Operator** (`juice@campus.edu` / `password123`)
- **Stationery Incharge** (`stationery@campus.edu` / `password123`)
- 4 realistic campus stalls linked to their respective owners.

---

## Zero-Config Demo Mode

CampusPay was engineered with a **fail-safe design**. If MongoDB or the backend is offline:
1. **Frontend Fallback:** The client automatically falls back to curated sample stalls (`Main Canteen`, `Juice Corner`, `Campus Stationery`, `Tech Café`).
2. **One-Click Demo Owner Mode:** On the Login page (`/dashboard/login`), click **"⚡ Explore Dashboard in Demo Mode"** to instantly test owner capabilities (updating stall information, toggling open/close, and updating payment methods) in memory.
3. **Resilient Backend:** The Express API detects if MongoDB is unavailable and serves demo responses with clear status messages instead of crashing.

---

## Testing User Flows

1. **Stall Search & Filtering:**
   - Go to [Explore Stalls](http://localhost:5173/stalls).
   - Type `"juice"` into the search bar. Observe that only Juice Corner is displayed.
   - Click the **"Cash Accepted"** chip. Observe that Juice Corner disappears because it is UPI-only.
2. **Authorized QR Code Inspection:**
   - Click **"View Payment Options"** on any stall card.
   - Click the green **"View UPI QR Code"** button. The accessible modal appears with safety reminders.
   - Press `Escape` or click the `X` button to dismiss.
3. **Payment Troubleshooting:**
   - Navigate to [Payment Help](http://localhost:5173/payment-help).
   - Click **"Money Deducted"** tag or search `"refund"`.
   - Expand the accordion to review step-by-step resolution advice.
4. **Owner Dashboard:**
   - Navigate to `/dashboard/login`.
   - Click **"⚡ Explore Dashboard in Demo Mode"** (or log in with registered credentials).
   - Edit stall hours, toggle "Accepts Cash", and click **"Save Changes"**.
   - Review live feedback notification toasts.

---

## Deployment Guide (Vercel & Render)

### Frontend Deployment on Vercel
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `client`.
4. Configure the environment variable:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`
5. Deploy.

### Backend Deployment on Render
1. Create a new **Web Service** in [Render](https://render.com).
2. Set the **Root Directory** to `server`.
3. Set **Build Command** to: `npm install`
4. Set **Start Command** to: `node app.js`
5. Add the required Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random secret
   - `CLIENT_URL`: Your Vercel frontend URL
6. Deploy.

---

## Limitations & Future Improvements

### Current Limitations
- **Demonstration QR Images:** For safety and compliance, initial demonstration stalls display mock QR placeholders. Real QR images must be uploaded by authorized stall owners via the dashboard.
- **Client-Side Demo Memory:** When running in Demo Mode without MongoDB, stall edits are persisted in React component state for that session only.

### Roadmap & Future Enhancements
- **Crowdsourced Status Verification:** Allow students to report stall busy levels (e.g., "5-min wait", "Long queue").
- **Campus Push Notifications:** Alert students when a closed stall opens for evening service.
- **Offline PWA Support:** Cache stall payment instructions in a Service Worker so students can view them even with zero network reception.
