import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, User, Building, UserCheck, ShieldCheck } from 'lucide-react'

export default function RegisterPage() {
  const { register, loginAsDemo } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [role, setRole] = useState(searchParams.get('role') || 'SEEKER')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await register({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
        phone,
        company_name: companyName
      })
      navigate('/')
    } catch (err) {
      console.error('Registration error:', err)
      const data = err.response?.data
      let msg = 'Registration failed. Please check your details.'
      if (data) {
        if (typeof data === 'string') msg = data
        else if (data.error) msg = data.error
        else if (data.detail) msg = data.detail
        else if (data.username) msg = `Username: ${Array.isArray(data.username) ? data.username.join(' ') : data.username}`
        else if (data.email) msg = `Email: ${Array.isArray(data.email) ? data.email.join(' ') : data.email}`
        else if (data.password) msg = `Password: ${Array.isArray(data.password) ? data.password.join(' ') : data.password}`
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = async (demoRole) => {
    try {
      setLoading(true)
      setError('')
      await loginAsDemo(demoRole)
      navigate('/')
    } catch (err) {
      setError('Demo login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30">
          <Briefcase className="w-7 h-7" />
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Create your Account</h2>
        <p className="mt-2 text-sm text-slate-600">Join JobConnect to launch your career or hire talent</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-200 space-y-6">
          
          {/* Role Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('SEEKER')}
              className={`w-1/2 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${role === 'SEEKER' ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}
            >
              <User className="w-4 h-4" />
              <span>Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('EMPLOYER')}
              className={`w-1/2 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${role === 'EMPLOYER' ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}
            >
              <Building className="w-4 h-4" />
              <span>Employer</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            {role === 'EMPLOYER' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'SEEKER' ? 'Job Seeker' : 'Employer'}`}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-sm text-slate-600">Already registered? </span>
            <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>

        </div>

        {/* Quick Demo Logins - Simple & Clean without heavy shadow */}
        <div className="mt-6 bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
            ⚡ Quick Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button" 
              onClick={() => handleQuickDemo('SEEKER')}
              className="py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              <span>Job Seeker</span>
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickDemo('EMPLOYER')}
              className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1"
            >
              <Building className="w-3.5 h-3.5 mr-1" />
              <span>Employer</span>
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickDemo('ADMIN')}
              className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
