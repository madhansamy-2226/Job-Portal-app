import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import API from '../../api/axios'
import { User, FileText, Download, CheckCircle, Search, Filter, Eye, Phone, Mail, MapPin } from 'lucide-react'

export default function ApplicantsPage() {
  const [searchParams] = useSearchParams()
  const jobIdParam = searchParams.get('job_id')

  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState(jobIdParam || 'ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Candidate detail modal state
  const [selectedApp, setSelectedApp] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [feedbackNote, setFeedbackNote] = useState('')

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [appRes, jobsRes] = await Promise.all([
        API.get('/applications/'),
        API.get('/jobs/?employer_only=true')
      ])
      setApplications(appRes.data.results || appRes.data)
      setJobs(jobsRes.data.results || jobsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingStatus(true)
      const res = await API.patch(`/applications/${appId}/update-status/`, {
        status: newStatus,
        employer_notes: feedbackNote
      })

      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus, employer_notes: feedbackNote } : a))
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => ({ ...prev, status: newStatus, employer_notes: feedbackNote }))
      }
    } catch (err) {
      alert('Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const filtered = applications.filter(app => {
    if (selectedJobId !== 'ALL' && String(app.job?.id || app.job) !== String(selectedJobId)) return false
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const name = (app.seeker_name || '').toLowerCase()
      const title = (app.job_title || '').toLowerCase()
      if (!name.includes(q) && !title.includes(q)) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Applicant Tracking System (ATS)</h1>
            <p className="text-slate-500 text-sm mt-1">Review candidate resumes, evaluate portfolios, and update recruitment statuses</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search candidate name..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="bg-transparent w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              value={selectedJobId} 
              onChange={(e) => setSelectedJobId(e.target.value)} 
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
            >
              <option value="ALL">All Jobs ({applications.length} Applicants)</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} ({j.applications_count})</option>
              ))}
            </select>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applicants Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading candidate submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
            <User className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No candidate applications found</h3>
            <p className="text-sm text-slate-500">Try clearing status or job filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Applied Position</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Resume</th>
                    <th className="px-6 py-4">Status & Action</th>
                    <th className="px-6 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{app.seeker_name}</div>
                        <div className="text-xs text-slate-500">{app.seeker_headline || app.seeker?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{app.job_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={app.resume_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" /> PDF Resume
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none ${
                            app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                            app.status === 'SELECTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            app.status === 'INTERVIEW' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            app.status === 'SHORTLISTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="SELECTED">Selected</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => { setSelectedApp(app); setModalOpen(true); setFeedbackNote(app.employer_notes || ''); }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Candidate Profile Modal */}
      {modalOpen && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Candidate Evaluation Profile</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="flex items-center space-x-4">
              <img 
                src={selectedApp.seeker?.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'} 
                alt="avatar" 
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h4 className="text-xl font-bold text-slate-900">{selectedApp.seeker_name}</h4>
                <p className="text-xs text-blue-600 font-semibold">{selectedApp.seeker_headline}</p>
                <p className="text-xs text-slate-500 mt-1">Applied for <strong>{selectedApp.job_title}</strong></p>
              </div>
            </div>

            {/* Cover note */}
            {selectedApp.cover_note && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Cover Note</label>
                <p className="text-xs text-slate-700 leading-relaxed italic">"{selectedApp.cover_note}"</p>
              </div>
            )}

            {/* Skills */}
            {selectedApp.seeker?.seeker_profile?.skills && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Skills</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.seeker.seeker_profile.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase">Employer Feedback Note</label>
              <textarea 
                rows={2} 
                value={feedbackNote} 
                onChange={(e) => setFeedbackNote(e.target.value)} 
                placeholder="e.g. Scheduled technical interview for Friday..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <button 
                onClick={() => handleStatusChange(selectedApp.id, selectedApp.status)}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg"
              >
                Save Feedback
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <a 
                href={selectedApp.resume_url} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <Download className="w-4 h-4 mr-1" /> Download Resume PDF
              </a>
              <button 
                onClick={() => setModalOpen(false)} 
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
