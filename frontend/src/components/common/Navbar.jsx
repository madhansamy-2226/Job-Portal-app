import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Briefcase, Search, User, LogOut, LayoutDashboard, 
  FileText, Bookmark, PlusCircle, Building, ShieldCheck, ChevronDown, Menu, X 
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-16">
          {/* Left Corner: JobConnect Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 transition">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight group-hover:text-blue-400 transition">
                JobConnect
              </span>
            </Link>
          </div>

          {/* Right Side: Home, Find Jobs, Login, Register / User Profile */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/jobs" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center space-x-1">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Find Jobs</span>
            </Link>
            {user?.role === 'EMPLOYER' && (
              <Link to="/employer/jobs/create" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1">
                <PlusCircle className="w-4 h-4" />
                <span>Post a Job</span>
              </Link>
            )}

            {user ? (
              <div className="relative pl-2">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 border border-slate-700 transition"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-white leading-tight">
                      {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                    </div>
                    <div className="text-[10px] text-blue-400 font-bold capitalize">
                      {user.role === 'SEEKER' ? 'Job Seeker' : user.role === 'EMPLOYER' ? user.company_name || 'Employer' : 'Administrator'}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50 text-slate-200"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-blue-900/60 text-blue-300">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'SEEKER' && (
                      <>
                        <Link to="/seeker/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                          <LayoutDashboard className="w-4 h-4 mr-3 text-slate-400" /> Dashboard
                        </Link>
                        <Link to="/seeker/profile" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                          <User className="w-4 h-4 mr-3 text-slate-400" /> My Profile
                        </Link>
                        <Link to="/seeker/applications" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                          <FileText className="w-4 h-4 mr-3 text-slate-400" /> My Applications
                        </Link>
                        <Link to="/seeker/saved-jobs" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                          <Bookmark className="w-4 h-4 mr-3 text-slate-400" /> Saved Jobs
                        </Link>
                      </>
                    )}

                    {user.role === 'EMPLOYER' && (
                      <>
                        <Link to="/employer/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                          <LayoutDashboard className="w-4 h-4 mr-3 text-slate-400" /> Employer Dashboard
                        </Link>
                        <Link to="/employer/jobs" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                          <Briefcase className="w-4 h-4 mr-3 text-slate-400" /> Manage Jobs
                        </Link>
                        <Link to="/employer/applicants" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                          <User className="w-4 h-4 mr-3 text-slate-400" /> Applicants ATS
                        </Link>
                        <Link to="/employer/company" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                          <Building className="w-4 h-4 mr-3 text-slate-400" /> Company Profile
                        </Link>
                      </>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                        <ShieldCheck className="w-4 h-4 mr-3 text-purple-400" /> Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left flex items-center px-4 py-2 text-xs font-bold text-red-400 hover:bg-slate-800"
                    >
                      <LogOut className="w-4 h-4 mr-3" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-blue-500/30 transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-300 p-2">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 text-slate-300">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-semibold hover:text-white">Home</Link>
          <Link to="/jobs" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-semibold hover:text-white">Find Jobs</Link>

          {user ? (
            <>
              {user.role === 'SEEKER' && <Link to="/seeker/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-bold text-blue-400">Job Seeker Dashboard</Link>}
              {user.role === 'EMPLOYER' && <Link to="/employer/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-bold text-blue-400">Employer Dashboard</Link>}
              {user.role === 'ADMIN' && <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-bold text-purple-400">Admin Dashboard</Link>}
              <button onClick={handleLogout} className="block w-full text-left py-2 text-sm font-bold text-red-400">Logout</button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center py-2 border border-slate-700 rounded-xl text-slate-300 font-bold text-xs">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block w-full text-center py-2 bg-blue-600 text-white rounded-xl font-bold text-xs">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
