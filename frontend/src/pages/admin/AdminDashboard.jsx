import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { ShieldCheck, Users, Briefcase, FileText, Building, CheckCircle, Power, Trash2 } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0, total_seekers: 0, total_employers: 0,
    total_jobs: 0, active_jobs: 0, total_applications: 0, total_companies: 0
  })
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [activeTab, setActiveTab] = useState('USERS')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        API.get('/analytics/admin/'),
        API.get('/admin/users/'),
        API.get('/jobs/?include_inactive=true')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data.results || usersRes.data)
      setJobs(jobsRes.data.results || jobsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserActive = async (userObj) => {
    try {
      await API.patch(`/admin/users/${userObj.id}/`, { is_active: !userObj.is_active })
      setUsers(users.map(u => u.id === userObj.id ? { ...u, is_active: !u.is_active } : u))
    } catch (err) {
      alert('Failed to update user status.')
    }
  }

  const toggleFeaturedJob = async (job) => {
    try {
      await API.patch(`/jobs/${job.id}/`, { is_featured: !job.is_featured })
      setJobs(jobs.map(j => j.id === job.id ? { ...j, is_featured: !j.is_featured } : j))
    } catch (err) {
      alert('Failed to feature job.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <span className="px-3 py-1 bg-white/20 text-xs font-semibold rounded-full uppercase tracking-wider">Super Administrator</span>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-2">Platform Control Panel</h1>
            <p className="text-purple-100 text-sm mt-1">Manage users, oversee job listings, and inspect system metrics</p>
          </div>
          <ShieldCheck className="w-12 h-12 text-purple-300 hidden sm:block" />
        </div>

        {/* System Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-purple-600">{stats.total_users}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Users</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-blue-600">{stats.total_seekers}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Job Seekers</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-indigo-600">{stats.total_employers}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Employers</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-emerald-600">{stats.total_jobs}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-amber-500">{stats.active_jobs}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-rose-500">{stats.total_applications}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Applications</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex border-b border-slate-100 space-x-6">
            <button 
              onClick={() => setActiveTab('USERS')}
              className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'USERS' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500'}`}
            >
              Manage Users ({users.length})
            </button>
            <button 
              onClick={() => setActiveTab('JOBS')}
              className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'JOBS' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500'}`}
            >
              Manage All Jobs ({jobs.length})
            </button>
          </div>

          {activeTab === 'USERS' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Username & Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined Date</th>
                    <th className="px-4 py-3">Account Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{u.username}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'EMPLOYER' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{new Date(u.date_joined).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${u.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {u.is_active ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => toggleUserActive(u)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded"
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Job Title & Company</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Featured on Home</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{j.title}</div>
                        <div className="text-xs text-slate-500">{j.company?.name}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">{j.location}</td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => toggleFeaturedJob(j)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${j.is_featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {j.is_featured ? '⭐ Featured' : 'Normal'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs">{j.is_active ? 'Active' : 'Inactive'}</td>
                      <td className="px-4 py-3 text-right">
                        <a href={`/jobs/${j.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-semibold hover:underline">
                          View
                        </a>
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
