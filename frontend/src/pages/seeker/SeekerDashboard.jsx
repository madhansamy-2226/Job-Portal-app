import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { FileText, Bookmark, CheckCircle2, Clock, MapPin, Building, ArrowRight, User } from 'lucide-react'

// Application Status Pipeline Steps
const STATUS_STEPS = [
  { key: 'APPLIED', label: 'Applied' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'SELECTED', label: 'Selected' }
]

const getStatusStepIndex = (status) => {
  if (status === 'REJECTED') return -1
  return STATUS_STEPS.findIndex(s => s.key === status)
}

export default function SeekerDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [appRes, savedRes] = await Promise.all([
        API.get('/applications/'),
        API.get('/saved-jobs/')
      ])
      setApplications(appRes.data.results || appRes.data)
      setSavedJobs(savedRes.data.results || savedRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const shortlistedCount = applications.filter(a => ['SHORTLISTED', 'INTERVIEW', 'SELECTED'].includes(a.status)).length

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Welcome back, {user?.first_name || user?.username}! 👋
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Track your job applications, view status updates, and update your resume profile.
            </p>
          </div>
          <Link 
            to="/seeker/profile" 
            className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-sm font-bold shadow transition flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>Update Profile & Resume</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{applications.length}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Applications</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">{shortlistedCount}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Shortlisted / Interview</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-600">{savedJobs.length}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Saved Jobs</div>
            </div>
          </div>
        </div>

        {/* Application Status Pipeline Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Application Status Tracker</h2>
              <p className="text-xs text-slate-500">Live progress pipeline for your active applications</p>
            </div>
            <Link to="/seeker/applications" className="text-sm font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400">Loading pipeline...</div>
          ) : applications.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">You haven't applied for any jobs yet.</p>
              <Link to="/jobs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                Explore Jobs & Apply
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {applications.slice(0, 3).map((app) => {
                const currentStepIdx = getStatusStepIndex(app.status)
                const isRejected = app.status === 'REJECTED'

                return (
                  <div key={app.id} className="border border-slate-100 rounded-xl p-5 bg-slate-50 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{app.job_title}</h3>
                        <p className="text-xs text-slate-500">{app.company_name} • Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full w-fit ${
                        isRejected ? 'bg-red-100 text-red-700' :
                        app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'INTERVIEW' ? 'bg-purple-100 text-purple-700 font-bold animate-pulse' :
                        app.status === 'SHORTLISTED' ? 'bg-blue-100 text-blue-700 font-bold' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        Status: {app.status}
                      </span>
                    </div>

                    {/* Progress Stepper Line */}
                    {isRejected ? (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-700 font-semibold">
                        ❌ Application Status: Rejected by employer. Keep applying for other opportunities!
                      </div>
                    ) : (
                      <div className="py-3 px-2">
                        <div className="flex items-center justify-between relative">
                          {/* Connection line */}
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

                          {STATUS_STEPS.map((step, idx) => {
                            const isPassed = idx <= currentStepIdx
                            const isCurrent = idx === currentStepIdx

                            return (
                              <div key={step.key} className="flex flex-col items-center relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110' :
                                  isPassed ? 'bg-emerald-600 text-white' :
                                  'bg-white text-slate-400 border-2 border-slate-300'
                                }`}>
                                  {isPassed ? (isCurrent ? idx + 1 : '✓') : idx + 1}
                                </div>
                                <span className={`text-[11px] mt-1.5 font-semibold ${isCurrent ? 'text-blue-700 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {app.employer_notes && (
                      <div className="text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-700 italic">
                        <strong>Employer Feedback Note:</strong> "{app.employer_notes}"
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
