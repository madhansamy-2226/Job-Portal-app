import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import { Briefcase, PlusCircle, Trash2, Edit, Eye, Power } from 'lucide-react'

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await API.get('/jobs/?employer_only=true')
      setJobs(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (job) => {
    try {
      await API.patch(`/jobs/${job.id}/`, { is_active: !job.is_active })
      setJobs(jobs.map(j => j.id === job.id ? { ...j, is_active: !j.is_active } : j))
    } catch (err) {
      alert('Failed to update job status.')
    }
  }

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return
    try {
      await API.delete(`/jobs/${jobId}/`)
      setJobs(jobs.filter(j => j.id !== jobId))
    } catch (err) {
      alert('Failed to delete job.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Manage Job Postings</h1>
            <p className="text-slate-500 text-sm mt-1">View active/inactive listings, edit requirements, or review applicants</p>
          </div>

          <Link 
            to="/employer/jobs/create" 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading listings...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No jobs posted yet</h3>
            <Link to="/employer/jobs/create" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Salary</th>
                    <th className="px-6 py-4">Applicants</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-900">{job.title}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{job.category_name}</td>
                      <td className="px-6 py-4 text-xs">{job.location}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-emerald-600">{job.salary_text || '₹4 - ₹7 LPA'}</td>
                      <td className="px-6 py-4">
                        <Link to={`/employer/applicants?job_id=${job.id}`} className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold rounded-full">
                          {job.applications_count} Applicants
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleActive(job)}
                          className={`px-3 py-1 text-xs font-bold rounded-full border transition flex items-center space-x-1 ${job.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{job.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => deleteJob(job.id)} 
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  )
}
