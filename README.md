# 🏥 Medicare Pro — Hospital Management System

A full-stack, production-ready Hospital Management System built with the MERN stack
(MongoDB, Express, React, Node.js). Includes role-based dashboards for Admin, Doctor
and Patient, appointment booking, billing/invoicing, pharmacy stock management,
laboratory test tracking, and a premium glassmorphism-inspired UI.

## 📁 Project Structure

```
Medicare-Pro/
├── backend/     → Node.js + Express + MongoDB REST API
└── frontend/    → React 19 + Vite client application
```

## ✨ Features

- **Authentication**: JWT-based login/register with role-based access (Admin, Doctor, Patient), bcrypt password hashing
- **Admin Dashboard**: Revenue & patient charts, key stats, recent appointments
- **Doctor Management**: Add/edit/remove doctors, specializations, departments, availability
- **Patient Management**: Patient profiles, medical history, appointment & billing summaries
- **Appointments**: Book, approve, reject, complete, and cancel appointments (role-aware)
- **Billing**: Itemized invoices with GST & discount calculation, payment status tracking
- **Pharmacy**: Medicine inventory with stock levels, expiry tracking and low-stock alerts
- **Laboratory**: Test requests (Blood, Urine, MRI, CT Scan, X-Ray) with result entry
- **Profile & Settings**: Profile photo upload, password change, hospital branding settings
- **Security**: Helmet, rate limiting, input validation, JWT auth, role authorization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local install or a free MongoDB Atlas cluster)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
npm run dev
```

The API will run on `http://localhost:5000`.

### 2. Seed the Database (recommended)

This creates an admin account, sample doctors, departments, a sample patient and
medicines so you can log in and explore immediately:

```bash
cd backend
node seed/seeder.js
```

**Demo Credentials (after seeding):**
| Role    | Email                          | Password     |
|---------|---------------------------------|---------------|
| Admin   | admin@medicarepro.com          | Admin@123     |
| Doctor  | aarav.doctor@medicarepro.com   | Doctor@123    |
| Patient | patient@medicarepro.com        | Patient@123   |

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will run on `http://localhost:5173` and proxy `/api` requests to the backend.

## 🛠 Tech Stack

**Frontend:** React 19, Vite, React Router, Axios, Chart.js, React Icons, React Toastify
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, Helmet
**Security:** express-rate-limit, helmet, role-based middleware, password hashing

## 📌 Notes for Extending This Project

This is a solid, working core of the full Medicare Pro vision. A few areas were kept
intentionally simple so the project stays runnable end-to-end — extend them as needed:

- **PDF/Excel export** — hook up a library like `jspdf` or `exceljs` on invoice/report pages
- **Dark mode** — the CSS theme variables and toggle button are already wired up (see `DashboardLayout`)
- **Real-time notifications** — the `Notification` model/routes exist; connect them to a bell icon UI or Socket.io for live push
- **Departments admin CRUD UI** — backend routes exist (`/api/departments`); no dedicated admin page yet
- **Image uploads** — profile photos and hospital logo already work via Multer; add more upload points as needed

## 📄 License

Built for portfolio and educational use.

## 🔐 Google Sign-In Setup

1. Go to https://console.cloud.google.com and create a project.
2. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**.
3. Configure the consent screen (External, add your app name and email) if prompted.
4. Application type: **Web application**. Add `http://localhost:5173` under **Authorized JavaScript origins**.
5. Copy the generated **Client ID** (no secret needed for this flow).
6. Add it to `backend/.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```
7. Add it to `frontend/.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```
8. Restart both backend and frontend dev servers.

## 📧 Email Notifications Setup (Gmail)

1. Enable **2-Step Verification** on the Gmail account you want to send from (Google Account → Security).
2. Under Security, search for **"App Passwords"** and generate one (any name works).
3. Copy the 16-character app password.
4. Add both to `backend/.env`:
   ```
   EMAIL_USER=youraddress@gmail.com
   EMAIL_APP_PASSWORD=your16charapppassword
   ```
5. Restart the backend. Emails are sent automatically on: registration (welcome email),
   appointment booking (confirmation), and appointment status changes (approved/rejected/completed).
6. If these variables are left blank, the app still works normally — emails are just skipped
   (logged to the console) instead of causing errors.
