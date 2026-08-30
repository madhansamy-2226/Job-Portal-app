import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { 
  MapPin, Briefcase, Building, Bookmark, CheckCircle, 
  Upload, ArrowLeft, Eye, Clock, Calendar, AlertCircle
} from 'lucide-react'

export default function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  // Apply Modal state
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverNote, setCoverNote] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeFilename, setResumeFilename] = useState('')
  const [applySubmitting, setApplySubmitting] = useState(false)
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchJobDetail()
  }, [id])

  const fetchJobDetail = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/jobs/${id}/`)
      setJob(res.data)
      setSaved(res.data.is_saved)

      // Set default resume from user profile if available
      if (user?.seeker_profile?.resume_url) {
        setResumeUrl(user.seeker_profile.resume_url)
        setResumeFilename(user.seeker_profile.resume_filename || 'My_Uploaded_Resume.pdf')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSave = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const res = await API.post(`/jobs/${id}/save_job/`)
      setSaved(res.data.saved)
    } catch (err) {
      console.error(err)
    }
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role === 'EMPLOYER') {
      setApplyMessage({ type: 'error', text: 'Employers cannot apply for job listings.' })
      return
    }

    try {
      setApplySubmitting(true)
      setApplyMessage({ type: '', text: '' })

      await API.post(`/applications/job/${id}/apply/`, {
        resume_url: resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resume_filename: resumeFilename || 'Resume.pdf',
        cover_note: coverNote
      })

      setApplyMessage({ type: 'success', text: '🎉 Application submitted successfully!' })
      setTimeout(() => {
        setShowApplyModal(false)
        navigate('/seeker/dashboard')
      }, 1500)
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit application.'
      setApplyMessage({ type: 'error', text: msg })
    } finally {
      setApplySubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen py-16 text-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Job Posting Not Found</h2>
        <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Back to Jobs</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to All Jobs
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <img 
                src={job.company?.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'} 
                alt={job.company?.name} 
                className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{job.title}</h1>
                <p className="text-slate-600 font-medium mt-1">{job.company?.name} • <span className="text-blue-600 font-semibold">{job.category_name}</span></p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400" />{job.location}</span>
                  <span className="font-semibold text-slate-800"><span className="text-emerald-600">💰</span> {job.salary_text || '₹4 - ₹7 LPA'}</span>
                  <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1 text-slate-400" />{job.job_type === 'FULL_TIME' ? 'Full Time' : job.job_type}</span>
                  <span className="flex items-center"><Eye className="w-4 h-4 mr-1 text-slate-400" />{job.views_count} views</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleSave}
                className={`p-3 rounded-xl border font-semibold text-sm flex items-center transition ${saved ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>

              <button 
                onClick={() => setShowApplyModal(true)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Main Details (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Job Overview</h2>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Key Responsibilities</h2>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{job.responsibilities}</p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Requirements & Qualifications</h2>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(job.skills_required || []).map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Company Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">About Company</h2>
              <div className="flex items-center space-x-3">
                <img 
                  src={job.company?.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'} 
                  alt="company logo" 
                  className="w-12 h-12 rounded-lg object-cover border"
                />
                <div>
                  <h3 className="font-bold text-slate-900">{job.company?.name}</h3>
                  <p className="text-xs text-slate-500">{job.company?.industry}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{job.company?.about}</p>
              
              <div className="border-t border-slate-100 pt-3 text-xs space-y-2 text-slate-600">
                <div><strong>Location:</strong> {job.company?.location}</div>
                <div><strong>Company Size:</strong> {job.company?.size}</div>
                {job.company?.website && (
                  <div>
                    <strong>Website:</strong>{' '}
                    <a href={job.company?.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {job.company?.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* APPLICATION MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Apply for {job.title}</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {applyMessage.text && (
              <div className={`p-3 rounded-lg text-xs font-semibold ${applyMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {applyMessage.text}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Resume File Name / URL</label>
                <input 
                  type="text" 
                  value={resumeFilename}
                  onChange={(e) => setResumeFilename(e.target.value)}
                  placeholder="e.g. Rahul_Resume.pdf"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
                  required
                />
                <input 
                  type="url" 
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="Resume PDF URL (Stored in Supabase)"
                  className="w-full mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Cover Note (Optional)</label>
                <textarea 
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Explain briefly why you are a great fit for this role..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowApplyModal(false)}
                  className="w-1/2 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={applySubmitting}
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow transition disabled:opacity-50"
                >
                  {applySubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
