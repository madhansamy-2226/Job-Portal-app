import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, Lock, Mail, UserCheck, ShieldCheck, Building } from 'lucide-react'

export default function LoginPage() {
  const { login, loginAsDemo } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = async (role) => {
    try {
      setLoading(true)
      setError('')
      await loginAsDemo(role)
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
        <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Sign in to JobConnect</h2>
        <p className="mt-2 text-sm text-slate-600">Access your candidate or employer dashboard</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-200 space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Username or Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-sm text-slate-600">Don't have an account? </span>
            <Link to="/register" className="text-sm font-semibold text-blue-600 hover:underline">
              Create an Account
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
