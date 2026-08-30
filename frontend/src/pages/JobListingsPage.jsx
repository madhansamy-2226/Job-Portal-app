import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import API from '../api/axios'
import { Search, MapPin, Filter, Bookmark, Check, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function JobListingsPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedJobType, setSelectedJobType] = useState(searchParams.get('job_type') || '')
  const [selectedExp, setSelectedExp] = useState(searchParams.get('experience') || '')
  const [savedJobs, setSavedJobs] = useState({})

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories/')
      setCategories(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(searchParams)
      const res = await API.get(`/jobs/?${params.toString()}`)
      const jobList = res.data.results || res.data
      setJobs(jobList)

      // Initialize saved status map
      const savedMap = {}
      jobList.forEach(j => { savedMap[j.id] = j.is_saved })
      setSavedJobs(savedMap)
    } catch (err) {
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault()
    const newParams = new URLSearchParams()
    if (search) newParams.set('search', search)
    if (location) newParams.set('location', location)
    if (selectedCategory) newParams.set('category_slug', selectedCategory)
    if (selectedJobType) newParams.set('job_type', selectedJobType)
    if (selectedExp) newParams.set('experience_level', selectedExp)
    setSearchParams(newParams)
  }

  const handleClearFilters = () => {
    setSearch('')
    setLocation('')
    setSelectedCategory('')
    setSelectedJobType('')
    setSelectedExp('')
    setSearchParams({})
  }

  const toggleSaveJob = async (jobId) => {
    if (!user) {
      alert('Please login to bookmark jobs.')
      return
    }
    try {
      const res = await API.post(`/jobs/${jobId}/save_job/`)
      setSavedJobs(prev => ({ ...prev, [jobId]: res.data.saved }))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Explore Job Openings</h1>
          <p className="text-slate-500 text-sm mt-1">Discover thousands of tech and non-tech career opportunities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filters */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 flex items-center">
                <Filter className="w-4 h-4 mr-2 text-blue-600" /> Filters
              </h2>
              <button onClick={handleClearFilters} className="text-xs text-blue-600 hover:underline font-medium">
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Search Keyword</label>
              <div className="flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Title, skill, company" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Location</label>
              <div className="flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Chennai, Bangalore, Remote" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Job Type</label>
              <select 
                value={selectedJobType} 
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="REMOTE">Remote</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Experience</label>
              <select 
                value={selectedExp} 
                onChange={(e) => setSelectedExp(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none"
              >
                <option value="">All Experience</option>
                <option value="FRESHER">Fresher / Entry Level</option>
                <option value="JUNIOR">Junior (1-3 yrs)</option>
                <option value="MID">Mid-Level (3-5 yrs)</option>
                <option value="SENIOR">Senior (5+ yrs)</option>
              </select>
            </div>

            <button 
              onClick={handleFilterSubmit}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
            >
              Apply Filters
            </button>
          </div>

          {/* Right Main Job Listings */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600">
              <span>Showing <strong className="text-slate-900">{jobs.length}</strong> jobs matching criteria</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium">Sorted by: Newest</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse h-36"></div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No jobs found matching your criteria</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try clearing your search keyword or selecting a different location/category filter.
                </p>
                <button 
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={job.company?.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'} 
                        alt={job.company?.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-100 mt-1"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg hover:text-blue-600 transition">
                          <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">{job.company?.name} • {job.category_name}</p>
                        
                        {/* Meta tags */}
                        <div className="mt-3 flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-600">
                          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />{job.location}</span>
                          <span className="font-semibold text-slate-700"><span className="text-emerald-600">💰</span> {job.salary_text || '₹4 - ₹7 LPA'}</span>
                          <span>💼 {job.job_type === 'FULL_TIME' ? 'Full Time' : job.job_type}</span>
                        </div>

                        {/* Skills */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(job.skills_required || []).map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-lg border transition ${savedJobs[job.id] ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'}`}
                      title={savedJobs[job.id] ? "Saved" : "Save Job"}
                    >
                      <Bookmark className={`w-5 h-5 ${savedJobs[job.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Posted on {new Date(job.created_at).toLocaleDateString()}</span>
                    <div className="flex space-x-3">
                      <Link to={`/jobs/${job.id}`} className="px-4 py-1.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:border-slate-400 transition">
                        View Details
                      </Link>
                      <Link to={`/jobs/${job.id}`} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
