# JobConnect – Smart Job Portal 🚀

JobConnect is a modern, responsive full-stack Job Portal web application built with **React.js**, **Python Django REST Framework**, and **Supabase** (PostgreSQL Database, Auth, and Storage). It connects Job Seekers with Employers and provides an Admin control panel.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS v4, Lucide React Icons, Axios, React Router Dom, Supabase JS SDK.
- **Backend**: Python 3.14, Django 4.2, Django REST Framework, SimpleJWT Authentication, Django Filters, CORS Headers.
- **Database & Cloud Services**: Supabase PostgreSQL Database, Supabase Auth & JWT Engine, Supabase Cloud Storage (Resumes, Photos, Logos).

---

## 🔑 Demo Credentials for Quick Testing

Use the 1-click **Quick Demo Login** bar on the navbar or login screen:

| Role | Username / Email | Password | Features / Dashboard Access |
|---|---|---|---|
| **Job Seeker** | `seeker@gmail.com` | `seeker123` | Search jobs, apply with resume PDF, track application status pipeline, bookmark jobs |
| **Employer** | `employer@techcorp.com` | `employer123` | Post & manage jobs, ATS candidate evaluation, download applicant resumes, update statuses |
| **Admin** | `admin@jobconnect.com` | `admin123` | Platform metrics dashboard, manage users, feature jobs, system oversight |

---

## 🌟 Key Features

### 1. 🏠 Screenshot-Accurate Homepage (`/`)
- **Hero Section**: "Welcome to Job Portal" banner card.
- **Role Cards**: Interactive cards for Job Seekers ("Register as Job Seeker"), Employers ("Register as Employer"), and Explore ("View Jobs").
- **Live Search Bar**: Keyword + Location search bar.
- **Statistics Section**: 4+ Active Jobs, 100+ Registered Users, 200+ Companies, 8 Categories.
- **Category Grid**: 8 categories (IT & Software, Data Science, Design, Mobile Development, Business, Healthcare, Marketing, Finance).
- **Featured Jobs**: 2x2 grid featuring job title, company logo, location, salary, job type, and skill pills.

### 2. 👨💼 Job Seeker Experience
- **Job Discovery (`/jobs`)**: Filter by category, job type, experience level, salary range, and location.
- **Job Details (`/jobs/:id`)**: Full description, responsibilities, requirements, and company profile.
- **1-Click Application**: Apply with uploaded resume PDF (Supabase Storage) and cover note.
- **Visual Application Status Tracker (`/seeker/dashboard`)**:
  - `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` / `Rejected`
- **Saved Jobs (`/seeker/saved-jobs`)**: Bookmark jobs for quick access.
- **Profile Management (`/seeker/profile`)**: Manage skills, bio, headline, and resume PDF uploads.

### 3. 🏢 Employer Experience & ATS
- **Employer Dashboard (`/employer/dashboard`)**: Stats for total posted jobs, active listings, applicants, and shortlisted candidates.
- **Job Management (`/employer/jobs`)**: Create, edit, toggle active/inactive status, or delete job postings.
- **Applicant Tracking System (ATS) (`/employer/applicants`)**:
  - Filter applicants by job and recruitment status.
  - Candidate profile modal & resume PDF download link.
  - Instant status updater dropdown (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Selected`, `Rejected`) with feedback notes.
- **Company Profile (`/employer/company`)**: Manage company logo, website, industry, and about description.

### 4. 👑 Admin Dashboard (`/admin/dashboard`)
- Real-time statistics across users, seekers, employers, jobs, and applications.
- User management table to activate/deactivate accounts.
- Job oversight table to feature postings on the homepage.

---

## ⚙️ Local Development Setup

### 1. Backend Setup (Django REST Framework)
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Populate seed demo data
python seed_data.py

# Start backend server
python manage.py runserver 8000
```
Backend API will run at `http://127.0.0.1:8000/api/`

### 2. Frontend Setup (React.js)
```bash
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```
Frontend Web Portal will run at `http://localhost:5173/`

---

## 📡 API Endpoints Overview

- `POST /api/auth/register/` - Register Seeker or Employer
- `POST /api/auth/login/` - JWT Login
- `GET/PUT /api/profile/` - Candidate / Employer Profile
- `GET/POST /api/jobs/` - Job Listings CRUD & Search
- `POST /api/jobs/:id/apply/` - Apply for a job
- `GET /api/applications/` - List user / employer applications
- `PATCH /api/applications/:id/update-status/` - ATS status updater
- `GET /api/analytics/stats/` - Public homepage metrics
