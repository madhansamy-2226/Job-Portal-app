import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Briefcase, Users, CheckCircle, PlusCircle, Building, Eye, ChevronRight } from 'lucide-react'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total_jobs: 0, active_jobs: 0, total_applicants: 0, shortlisted_candidates: 0 })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployerData()
  }, [])

  const fetchEmployerData = async () => {
    try {
      setLoading(true)
      const [statsRes, jobsRes] = await Promise.all([
        API.get('/analytics/employer/'),
        API.get('/jobs/?employer_only=true')
      ])
      setStats(statsRes.data)
      setRecentJobs((jobsRes.data.results || jobsRes.data).slice(0, 5))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-white/20 text-xs font-semibold rounded-full uppercase tracking-wider">Employer Portal</span>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-2">
              {user?.company_name || 'Employer Dashboard'}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Manage your job postings, track applicant resumes, and update recruitment pipeline statuses.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link 
              to="/employer/jobs/create" 
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow transition flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{stats.total_jobs}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Jobs Posted</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">{stats.active_jobs}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Active Listings</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-600">{stats.total_applicants}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Applicants</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-600">{stats.shortlisted_candidates}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Shortlisted Candidates</div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Jobs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Posted Jobs</h2>
              <p className="text-xs text-slate-500">Monitor live applicant counts and active statuses</p>
            </div>
            <div className="flex space-x-3">
              <Link to="/employer/applicants" className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold">
                Open Applicants ATS
              </Link>
              <Link to="/employer/jobs" className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold">
                Manage All Jobs
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400">Loading listings...</div>
          ) : recentJobs.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-slate-500">You haven't posted any job listings yet.</p>
              <Link to="/employer/jobs/create" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Job Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Salary</th>
                    <th className="px-4 py-3">Applicants</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{job.title}</td>
                      <td className="px-4 py-3 text-xs">{job.job_type === 'FULL_TIME' ? 'Full Time' : job.job_type}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-emerald-600">{job.salary_text || '₹4 - ₹7 LPA'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
                          {job.applications_count} Applicants
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${job.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Link to={`/employer/applicants?job_id=${job.id}`} className="text-xs text-blue-600 font-semibold hover:underline">
                          View Applicants
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
