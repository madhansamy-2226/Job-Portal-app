import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import { Bookmark, MapPin, Briefcase, Trash2 } from 'lucide-react'

export default function SeekerSavedJobs() {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      const res = await API.get('/saved-jobs/')
      setSavedJobs(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const removeSaved = async (jobId) => {
    try {
      await API.post(`/jobs/${jobId}/save_job/`)
      setSavedJobs(savedJobs.filter(s => s.job.id !== jobId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Saved / Bookmarked Jobs</h1>
          <p className="text-slate-500 text-sm mt-1">Jobs you saved to apply later</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading saved jobs...</div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No bookmarked jobs</h3>
            <Link to="/jobs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs">
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map(({ id, job }) => (
              <div key={id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={job.company?.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'} 
                    alt={job.company?.name} 
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg hover:text-blue-600">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500">{job.company?.name} • {job.location}</p>
                    <span className="inline-block mt-2 font-semibold text-xs text-emerald-600">
                      💰 {job.salary_text || '₹4 - ₹7 LPA'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link 
                    to={`/jobs/${job.id}`} 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                  >
                    View & Apply
                  </Link>
                  <button 
                    onClick={() => removeSaved(job.id)} 
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
