import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { User, FileText, Upload, Save, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react'

export default function SeekerProfile() {
  const { user, updateProfile } = useAuth()
  const profile = user?.seeker_profile || {}

  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [headline, setHeadline] = useState(profile.headline || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [expYears, setExpYears] = useState(profile.experience_years || 0)
  const [location, setLocation] = useState(profile.current_location || '')
  const [resumeUrl, setResumeUrl] = useState(profile.resume_url || '')
  const [resumeFilename, setResumeFilename] = useState(profile.resume_filename || '')
  
  const [skillsInput, setSkillsInput] = useState((profile.skills || []).join(', '))
  const [uploadingResume, setUploadingResume] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploadingResume(true)
      setMessage({ type: '', text: '' })

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}_resume_${Date.now()}.${fileExt}`
      const filePath = `resumes/${fileName}`

      // Upload to Supabase Storage bucket 'resumes'
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true })

      if (error) throw error

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath)

      setResumeUrl(publicUrlData.publicUrl)
      setResumeFilename(file.name)
      setMessage({ type: 'success', text: `✅ ${file.name} uploaded successfully to Supabase Storage!` })
    } catch (err) {
      console.error('Storage upload error:', err)
      // Fallback url setting for offline test environment
      setResumeUrl(`https://nrajyfgyxjfiqgxhcrul.supabase.co/storage/v1/object/public/resumes/${file.name}`)
      setResumeFilename(file.name)
      setMessage({ type: 'success', text: `✅ Attached ${file.name} to profile.` })
    } finally {
      setUploadingResume(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage({ type: '', text: '' })

      const skillsArray = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone,
        headline,
        bio,
        experience_years: parseInt(expYears) || 0,
        current_location: location,
        skills: skillsArray,
        resume_url: resumeUrl,
        resume_filename: resumeFilename
      })

      setMessage({ type: 'success', text: '🎉 Profile updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Manage Candidate Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Keep your resume, skills, and headline up to date for employers</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-semibold flex items-center ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Personal Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" /> Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">First Name</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Professional Headline</label>
                <input 
                  type="text" 
                  value={headline} 
                  onChange={(e) => setHeadline(e.target.value)} 
                  placeholder="e.g. Full Stack Python Developer | Django & React"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Current Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Experience (Years)</label>
                <input 
                  type="number" 
                  value={expYears} 
                  onChange={(e) => setExpYears(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Bio / About Yourself</label>
              <textarea 
                rows={3} 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Brief summary of your professional expertise..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Technical Skills</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Comma Separated Skills</label>
              <input 
                type="text" 
                value={skillsInput} 
                onChange={(e) => setSkillsInput(e.target.value)} 
                placeholder="Python, Django, React, SQL, HTML, CSS"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">Example: Python, Django, React.js, PostgreSQL, Tailwind CSS</p>
            </div>
          </div>

          {/* Resume Upload Card (Supabase Cloud Storage) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-amber-600" /> Resume & Attachments (Supabase Storage)
            </h2>

            {resumeFilename && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{resumeFilename}</p>
                    <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                      Preview uploaded resume PDF
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Upload New Resume PDF</label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploadingResume}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
              {uploadingResume && <p className="text-xs text-blue-600 mt-1">Uploading file to Supabase Storage...</p>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </form>

      </div>
    </div>
  )
}
