import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { Briefcase, Plus, Save, ArrowLeft, CheckCircle } from 'lucide-react'

export default function PostJobPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [jobType, setJobType] = useState('FULL_TIME')
  const [expLevel, setExpLevel] = useState('FRESHER')
  const [location, setLocation] = useState('Chennai, Tamil Nadu')
  const [salaryMin, setSalaryMin] = useState('400000')
  const [salaryMax, setSalaryMax] = useState('700000')
  const [salaryText, setSalaryText] = useState('₹4 - ₹7 LPA')
  const [skillsInput, setSkillsInput] = useState('Python, Django, SQL')
  const [description, setDescription] = useState('')
  const [responsibilities, setResponsibilities] = useState('')
  const [requirements, setRequirements] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories/')
      const cats = res.data.results || res.data
      setCategories(cats)
      if (cats.length > 0) setCategory(cats[0].id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean)

      await API.post('/jobs/', {
        category,
        title,
        job_type: jobType,
        experience_level: expLevel,
        location,
        salary_min: parseFloat(salaryMin) || 0,
        salary_max: parseFloat(salaryMax) || 0,
        salary_text: salaryText,
        skills_required: skillsArray,
        description,
        responsibilities,
        requirements,
        is_active: true
      })

      navigate('/employer/jobs')
    } catch (err) {
      setError('Failed to post job. Please ensure all required fields are filled.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Post a New Job Opening</h1>
          <p className="text-slate-500 text-sm mt-1">Create a comprehensive job posting to attract qualified talent</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Job Title *</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Python Developer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category *</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Job Type *</label>
              <select 
                value={jobType} 
                onChange={(e) => setJobType(e.target.value)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="REMOTE">Remote</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Experience Level *</label>
              <select 
                value={expLevel} 
                onChange={(e) => setExpLevel(e.target.value)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                <option value="FRESHER">Fresher / Entry Level</option>
                <option value="JUNIOR">Junior (1-3 yrs)</option>
                <option value="MID">Mid-Level (3-5 yrs)</option>
                <option value="SENIOR">Senior (5+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Location *</label>
              <input 
                type="text" 
                required 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="e.g. Chennai, Remote"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Salary Range Display Text *</label>
              <input 
                type="text" 
                required 
                value={salaryText} 
                onChange={(e) => setSalaryText(e.target.value)} 
                placeholder="e.g. ₹4 - ₹7 LPA"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Skills Required (Comma separated) *</label>
              <input 
                type="text" 
                required 
                value={skillsInput} 
                onChange={(e) => setSkillsInput(e.target.value)} 
                placeholder="Python, Django, SQL, REST API"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Job Description *</label>
            <textarea 
              rows={4} 
              required 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Overview of the position and role expectations..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Key Responsibilities</label>
            <textarea 
              rows={3} 
              value={responsibilities} 
              onChange={(e) => setResponsibilities(e.target.value)} 
              placeholder="List daily tasks and responsibilities..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Requirements & Qualifications</label>
            <textarea 
              rows={3} 
              value={requirements} 
              onChange={(e) => setRequirements(e.target.value)} 
              placeholder="List required degree, technical experience, soft skills..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => navigate('/employer/jobs')} 
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow transition disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Job Listing'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
