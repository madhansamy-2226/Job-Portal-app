import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { 
  Search, MapPin, Briefcase, Users, Building2, Layers, 
  Code, Database, Palette, Smartphone, HeartPulse, TrendingUp, Coins, ChevronRight,
  UserCheck, ShieldCheck, Building, CheckCircle2
} from 'lucide-react'

// Icon mapping helper
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'Code': return <Code className="w-8 h-8 text-blue-600" />
    case 'Database': return <Database className="w-8 h-8 text-purple-600" />
    case 'Palette': return <Palette className="w-8 h-8 text-rose-500" />
    case 'Smartphone': return <Smartphone className="w-8 h-8 text-cyan-600" />
    case 'HeartPulse': return <HeartPulse className="w-8 h-8 text-red-500" />
    case 'TrendingUp': return <TrendingUp className="w-8 h-8 text-amber-500" />
    case 'Coins': return <Coins className="w-8 h-8 text-emerald-600" />
    default: return <Briefcase className="w-8 h-8 text-indigo-600" />
  }
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user, loginAsDemo } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [stats, setStats] = useState({ active_jobs: 4, registered_users: 100, companies_count: 200, categories_count: 8 })
  const [categories, setCategories] = useState([])
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [demoLoading, setDemoLoading] = useState(false)

  useEffect(() => {
    fetchHomeData()
  }, [user])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      const [statsRes, catRes, jobsRes] = await Promise.all([
        API.get('/analytics/stats/'),
        API.get('/categories/'),
        API.get('/jobs/featured/')
      ])
      setStats(statsRes.data)
      setCategories(catRes.data.results || catRes.data)
      setFeaturedJobs(jobsRes.data.results || jobsRes.data)
    } catch (err) {
      console.error('Error loading homepage data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const queryParams = new URLSearchParams()
    if (keyword) queryParams.set('search', keyword)
    if (location) queryParams.set('location', location)
    navigate(`/jobs?${queryParams.toString()}`)
  }

  const handleQuickDemo = async (role) => {
    try {
      setDemoLoading(true)
      await loginAsDemo(role)
    } catch (err) {
      console.error(err)
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      
      {/* 1. HERO BANNER - Matching Blue Header Card in Screenshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Welcome to Job Portal
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-light">
              Find Your Dream Job Today • Connect with 200+ Top Companies
            </p>
            <div className="pt-2">
              <Link 
                to="/jobs" 
                className="inline-flex items-center px-6 py-3 bg-slate-900 hover:bg-black text-white font-semibold rounded-lg shadow-lg transition transform hover:-translate-y-0.5"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE ROLE CARDS - Matching Green Button Cards in Screenshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: For Job Seekers */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between text-center hover:shadow-md transition">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-slate-800">For Job Seekers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Find your dream job and build your career. Easily apply to top companies, upload your resume, and track your application status.
              </p>
            </div>
            <Link 
              to="/register?role=SEEKER" 
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-lg transition text-center block shadow"
            >
              Register as Job Seeker
            </Link>
          </div>

          {/* Card 2: For Employers */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between text-center hover:shadow-md transition">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-slate-800">For Employers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Post job listings, review applicant resumes, and find the perfect talented candidates for your company's growing team.
              </p>
            </div>
            <Link 
              to="/register?role=EMPLOYER" 
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-lg transition text-center block shadow"
            >
              Register as Employer
            </Link>
          </div>

          {/* Card 3: Easy to Use */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between text-center hover:shadow-md transition">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-slate-800">Easy to Use</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Explore our portal's powerful features. Connect with companies and discover exciting new career opportunities today.
              </p>
            </div>
            <Link 
              to="/jobs" 
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-lg transition text-center block shadow"
            >
              View Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SEARCH BAR - Matching exact Screenshot search inputs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 w-full">
        <form onSubmit={handleSearch} className="bg-white p-3 rounded-xl border border-slate-200 shadow-md flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full">
            <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Job title, skills, or company" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm text-slate-800"
            />
          </div>
          <div className="flex-1 flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full">
            <MapPin className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="City, Country, or Remote" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm text-slate-800"
            />
          </div>
          <button 
            type="submit" 
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition shadow-md flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Jobs</span>
          </button>
        </form>
      </section>

      {/* 4. RECENT STATISTICS - Matching Screenshot statistics cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent Statistics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl font-extrabold text-blue-600 mb-1">{stats.active_jobs}+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Jobs</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl font-extrabold text-blue-600 mb-1">{stats.registered_users}+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Registered Users</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl font-extrabold text-amber-500 mb-1">{stats.companies_count}+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Companies</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl font-extrabold text-emerald-600 mb-1">{stats.categories_count}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</div>
          </div>
        </div>
      </section>

      {/* 5. BROWSE BY CATEGORY - Matching 8 category cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Browse by Category</h2>
            <p className="text-slate-500 text-sm mt-1">Explore job opportunities by industry domain</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
            Explore All Jobs <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition text-center flex flex-col items-center group"
            >
              <div className="mb-3 p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">
                {cat.name}
              </h3>
              <span className="text-xs text-slate-400 mt-1">
                {cat.job_count ?? 1} {(cat.job_count === 1) ? 'job' : 'jobs'} open
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
