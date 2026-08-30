import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

import HomePage from './pages/HomePage'
import JobListingsPage from './pages/JobListingsPage'
import JobDetailPage from './pages/JobDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard'
import SeekerProfile from './pages/seeker/SeekerProfile'
import SeekerApplications from './pages/seeker/SeekerApplications'
import SeekerSavedJobs from './pages/seeker/SeekerSavedJobs'

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard'
import ManageJobsPage from './pages/employer/ManageJobsPage'
import PostJobPage from './pages/employer/PostJobPage'
import ApplicantsPage from './pages/employer/ApplicantsPage'
import CompanyProfilePage from './pages/employer/CompanyProfilePage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobListingsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Job Seeker Routes */}
              <Route path="/seeker/dashboard" element={<ProtectedRoute allowedRoles={['SEEKER']}><SeekerDashboard /></ProtectedRoute>} />
              <Route path="/seeker/profile" element={<ProtectedRoute allowedRoles={['SEEKER']}><SeekerProfile /></ProtectedRoute>} />
              <Route path="/seeker/applications" element={<ProtectedRoute allowedRoles={['SEEKER']}><SeekerApplications /></ProtectedRoute>} />
              <Route path="/seeker/saved-jobs" element={<ProtectedRoute allowedRoles={['SEEKER']}><SeekerSavedJobs /></ProtectedRoute>} />

              {/* Employer Routes */}
              <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><EmployerDashboard /></ProtectedRoute>} />
              <Route path="/employer/jobs" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><ManageJobsPage /></ProtectedRoute>} />
              <Route path="/employer/jobs/create" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><PostJobPage /></ProtectedRoute>} />
              <Route path="/employer/applicants" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><ApplicantsPage /></ProtectedRoute>} />
              <Route path="/employer/company" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><CompanyProfilePage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}
