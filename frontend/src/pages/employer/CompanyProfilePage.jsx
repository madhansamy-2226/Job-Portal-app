import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { Building, Save, CheckCircle, Upload } from 'lucide-react'

export default function CompanyProfilePage() {
  const { user, fetchProfile } = useAuth()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [size, setSize] = useState('')
  const [about, setAbout] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const res = await API.get('/companies/my_company/')
      const c = res.data
      setCompany(c)
      setName(c.name || '')
      setWebsite(c.website || '')
      setLogoUrl(c.logo_url || '')
      setIndustry(c.industry || 'Technology')
      setLocation(c.location || 'Bangalore, India')
      setSize(c.size || '50-200 employees')
      setAbout(c.about || '')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage('')
      if (company) {
        await API.put(`/companies/${company.id}/`, {
          name, website, logo_url: logoUrl, industry, location, size, about
        })
      } else {
        await API.post('/companies/', {
          name, website, logo_url: logoUrl, industry, location, size, about
        })
      }
      await fetchProfile()
      setMessage('🎉 Company profile updated successfully!')
    } catch (err) {
      setMessage('Failed to update company profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Company Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage brand details shown on your job listings</p>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-semibold flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company Name *</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Website URL</label>
              <input 
                type="url" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                placeholder="https://company.example.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company Logo URL</label>
              <input 
                type="url" 
                value={logoUrl} 
                onChange={(e) => setLogoUrl(e.target.value)} 
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Industry Domain</label>
              <input 
                type="text" 
                value={industry} 
                onChange={(e) => setIndustry(e.target.value)} 
                placeholder="e.g. IT & Software, Fintech"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Headquarters Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Chennai / Bangalore"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company Size</label>
              <input 
                type="text" 
                value={size} 
                onChange={(e) => setSize(e.target.value)} 
                placeholder="50-200 employees"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">About Company</label>
            <textarea 
              rows={4} 
              value={about} 
              onChange={(e) => setAbout(e.target.value)} 
              placeholder="Describe your organization's mission and culture..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={saving} 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow transition flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Update Company Profile'}</span>
          </button>
        </form>

      </div>
    </div>
  )
}
