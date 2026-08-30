import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import { FileText, MapPin, Building, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react'

export default function SeekerApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const res = await API.get('/applications/')
      setApplications(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filterStatus === 'ALL' 
    ? applications 
    : applications.filter(a => a.status === filterStatus)

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Job Applications</h1>
            <p className="text-slate-500 text-sm mt-1">Track all submitted applications and employer responses</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Filter:</span>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
            >
              <option value="ALL">All Statuses ({applications.length})</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No applications found</h3>
            <Link to="/jobs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs">
              Explore Available Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Job & Company</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4">Employer Feedback</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{app.job_title}</div>
                        <div className="text-xs text-slate-500">{app.company_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800 font-bold' :
                          app.status === 'INTERVIEW' ? 'bg-purple-100 text-purple-800 font-bold' :
                          app.status === 'SHORTLISTED' ? 'bg-blue-100 text-blue-800 font-bold' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 italic">
                        {app.employer_notes || '—'}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link 
                          to={`/jobs/${app.job?.id || app.job}`} 
                          className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
                        >
                          View Job
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
