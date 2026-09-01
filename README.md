# 🚀 JobConnect – Full-Stack Job Portal & ATS Platform

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django)
![Django REST Framework](https://img.shields.io/badge/DRF-API-red?logo=django)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Cloud_PostgreSQL_&_Storage-3ECF8E?logo=supabase)
![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?logo=vite)
![Deployment](https://img.shields.io/badge/Deployment-Vercel_%2B_Render-000000?logo=vercel)

**JobConnect** is an enterprise-grade, high-performance full-stack Job Portal and Applicant Tracking System (ATS) built with **React 19**, **Django REST Framework**, and **Supabase Cloud Infrastructure** (PostgreSQL Database & Storage).

It seamlessly bridges the gap between **Job Seekers**, **Employers**, and **Platform Administrators** through interactive dashboards, real-time application pipelines, direct resume PDF uploads, and flexible role-based access control.

---

## 🔗 Live Deployments & Repository Links

- 🌐 **Live Web Application (Vercel)**: [https://job-portal-applicaion.vercel.app](https://job-portal-applicaion.vercel.app)
- ⚙️ **Production REST API (Render)**: `https://jobconnect-api.onrender.com/api/`
- 📦 **GitHub Repository**: [https://github.com/madhansamy-2226/Job-Portal-app](https://github.com/madhansamy-2226/Job-Portal-app)
- 🗄️ **Database & Cloud Storage**: Supabase Cloud (`resumes` Public Bucket & PostgreSQL Host)

---

## ⚡ 1-Click Quick Demo Accounts

Test the platform instantly across all roles using the 1-Click Quick Demo Login bar available on the Navbar or Login/Register pages:

| Role | Username / Email | Password | Primary Capabilities & Access |
| :--- | :--- | :--- | :--- |
| **👨‍💻 Job Seeker** | `seeker@gmail.com` | `seeker123` | Search & filter jobs, apply with resume PDF, track application pipeline, save jobs |
| **🏢 Employer** | `employer@techcorp.com` | `employer123` | Post & manage job listings, review candidate resumes, update recruitment status (ATS) |
| **👑 Admin** | `admin@jobconnect.com` | `admin123` | Platform analytics dashboard, manage user accounts, feature job postings |

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |     React 19 SPA Frontend (Vite)      |
                                  |     Tailwind CSS v4 + Lucide Icons     |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS / REST APIs
                                                      v
                                  +-------------------+-------------------+
                                  |   Django REST API Backend (Python)    |
                                  |   SimpleJWT Auth + WhiteNoise + Gunicorn
                                  +-------------------+-------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
    +--------------------+--------------------+               +--------------------+--------------------+
    | Supabase Cloud PostgreSQL Database       |               | Supabase Cloud Resume Storage Bucket|
    | (Users, Jobs, Applications, Companies)   |               | (Public PDF Resume File Hosting)   |
    +-----------------------------------------+               +------------------------------------+
```

---

## ✨ Key Features & User Experiences

### 👨‍💻 1. Job Seeker Experience
- **Live Multi-Filter Job Search (`/jobs`)**: Filter jobs dynamically by category, job type (Full-Time, Remote, Contract, Internship), experience level (Fresher, Junior, Mid, Senior), salary range, and location.
- **Detailed Job View (`/jobs/:id`)**: Comprehensive job descriptions, responsibilities, requirements, skill tags, and company profile overviews.
- **1-Click Application**: Apply with an uploaded PDF resume (hosted directly on Supabase Storage) and a personalized cover note.
- **Visual Application Status Pipeline (`/seeker/dashboard`)**:
  - Track application lifecycle stages: `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` / `Rejected`.
- **Saved Jobs (`/seeker/saved-jobs`)**: Bookmark jobs to save for later review.
- **Candidate Profile Management (`/seeker/profile`)**: Manage headline, bio, experience, skills, GitHub/LinkedIn links, and uploaded resume files.

### 🏢 2. Employer Experience & Applicant Tracking System (ATS)
- **Employer Control Panel (`/employer/dashboard`)**: Metrics for active job listings, total received applications, shortlisted candidates, and interview schedules.
- **Job Management (`/employer/jobs`)**: Create, edit, toggle active/inactive status, or remove job listings.
- **Applicant Evaluation Hub (`/employer/applicants`)**:
  - Filter applicants by job posting and recruitment status.
  - Inspect candidate profiles and download uploaded PDF resumes directly.
  - Update candidate statuses instantly (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Selected`, `Rejected`) with customized feedback notes.
- **Company Profile (`/employer/company`)**: Manage company logo, website, industry, office locations, and overview details.

### 👑 3. Administrator Portal (`/admin/dashboard`)
- Real-time platform metrics across total registered users, seekers, employers, active jobs, and total applications.
- User management module to activate or deactivate user accounts.
- Job management module to feature selected jobs on the homepage banner.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: React 19.2 (Vite 8.2)
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **HTTP Client**: Axios with Bearer JWT Interceptors
- **Routing**: React Router Dom v7
- **Cloud Client**: Supabase JS SDK v2

### Backend Architecture
- **Framework**: Python 3.14 + Django 4.2 LTS
- **API Engine**: Django REST Framework (DRF)
- **Authentication**: SimpleJWT (JSON Web Tokens)
- **Database Connectivity**: `dj-database-url` + `psycopg2-binary`
- **Static File Serving**: WhiteNoise Static Storage Engine
- **WSGI Server**: Gunicorn

### Infrastructure & Cloud
- **Database**: Supabase Cloud PostgreSQL Database
- **Storage**: Supabase Storage (`resumes` Public Bucket)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render.com Web Service

---

## 📂 Repository Directory Layout

```
Job-Portal-app/
├── package.json               # Root monorepo build script (cross-platform path handler)
├── vercel.json                # Root Vercel deployment configuration
├── DEPLOYMENT.md              # Production deployment documentation
├── README.md                  # Project documentation
│
├── backend/                   # Django REST Framework API
│   ├── Procfile               # Gunicorn execution command for production
│   ├── render.yaml            # Render Blueprint deployment definition
│   ├── requirements.txt       # Pinned Python dependencies
│   ├── seed_data.py           # Automated database seeding script
│   ├── manage.py              # Django management CLI
│   ├── accounts/              # User Authentication, Profiles & Admin Views
│   ├── companies/             # Employer Company Profiles
│   ├── jobs/                  # Job Postings, Categories & Skills
│   ├── applications/          # Application Tracking System & Status Pipeline
│   ├── analytics/             # Platform Metrics & Statistics APIs
│   └── jobconnect/            # Project Settings, URLs & WSGI Config
│
└── frontend/                  # React 19 Single Page Application
    ├── vercel.json            # Subdirectory Vercel SPA rewrite rules
    ├── netlify.toml           # Netlify build configuration
    ├── package.json           # Frontend dependencies & scripts
    ├── vite.config.js         # Vite bundler configuration
    └── src/
        ├── api/               # Axios instance with auth interceptors
        ├── components/        # Common Navbar, Footer & Protected Routes
        ├── context/           # AuthContext with multi-fallback authentication
        ├── lib/               # Supabase Cloud Client integration
        └── pages/             # Seeker, Employer & Admin Dashboard pages
```

---

## 📡 API Specification & Endpoints

| Category | Endpoint | Method | Permission | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register/` | `POST` | Public | Register new Job Seeker or Employer |
| **Auth** | `/api/auth/login/` | `POST` | Public | Authenticate user & return JWT tokens |
| **Auth** | `/api/auth/refresh/` | `POST` | Public | Refresh expired JWT access token |
| **Profile** | `/api/profile/` | `GET` / `PUT` | Authenticated | Retrieve or update user profile |
| **Jobs** | `/api/jobs/` | `GET` / `POST` | Public / Employer | List, search, filter, or post jobs |
| **Jobs** | `/api/jobs/:id/` | `GET` / `PUT` / `DELETE` | Mixed | Retrieve detail, edit, or delete job |
| **Jobs** | `/api/jobs/featured/` | `GET` | Public | List featured jobs for homepage |
| **Applications**| `/api/applications/` | `GET` / `POST` | Authenticated | List applications or apply for a job |
| **Applications**| `/api/applications/:id/update-status/`| `PATCH` | Employer | Update ATS status & feedback notes |
| **Saved Jobs** | `/api/saved-jobs/` | `GET` / `POST` / `DELETE` | Seeker | Bookmark & manage saved jobs |
| **Categories** | `/api/categories/` | `GET` | Public | List job categories with job counts |
| **Analytics** | `/api/analytics/stats/` | `GET` | Public | Retrieve homepage statistics |
| **Analytics** | `/api/analytics/employer/` | `GET` | Employer | Retrieve employer dashboard metrics |
| **Analytics** | `/api/analytics/admin/` | `GET` | Admin | Retrieve system-wide platform metrics |

---

## ⚙️ Local Development Installation

### Prerequisites
- **Python**: `3.10+` installed
- **Node.js**: `18.0+` installed
- **Git**: Installed

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/madhansamy-2226/Job-Portal-app.git
cd Job-Portal-app
```

---

### Step 2: Backend Setup (Django REST API)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Populate sample seed data (Categories, Companies, Jobs & Demo Users)
python seed_data.py

# Start Django development server
python manage.py runserver 8000
```
- **Backend API URL**: `http://127.0.0.1:8000/api/`

---

### Step 3: Frontend Setup (React SPA)
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```
- **Frontend Portal URL**: `http://localhost:5173/`

---

## 🌐 Production Deployment Guide

### Deploying Frontend to Vercel
1. Import `Job-Portal-app` repository into [Vercel Dashboard](https://vercel.com).
2. Root [`vercel.json`](file:///C:/Django-job%20portal/vercel.json) will automatically handle build commands (`npm run build`).
3. Add Environment Variables:
   - `VITE_SUPABASE_URL` = `https://nrajyfgyxjfiqgxhcrul.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1...`
   - `VITE_API_URL` = `https://jobconnect-api.onrender.com/api`

### Deploying Backend to Render.com
1. Go to [Render Dashboard](https://dashboard.render.com/) ➔ New ➔ **Blueprint**.
2. Connect your GitHub repository. Render reads [`backend/render.yaml`](file:///C:/Django-job%20portal/backend/render.yaml).
3. Set Environment Variables: `SECRET_KEY`, `ALLOWED_HOSTS = .onrender.com`, `SUPABASE_URL`, `SUPABASE_KEY`.
4. Render will compile, run migrations, seed data, and launch Gunicorn automatically!

---

## 📄 License & Author

Developed with ❤️ by **Madhansamy**  
- **GitHub**: [@madhansamy-2226](https://github.com/madhansamy-2226)  
- **License**: Released under the [MIT License](LICENSE).
