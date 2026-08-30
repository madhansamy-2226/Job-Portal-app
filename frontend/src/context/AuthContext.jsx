import React, { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user_info')
    const token = localStorage.getItem('access_token')

    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
      // Verify profile from server
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await API.get('/profile/')
      setUser(res.data)
      localStorage.setItem('user_info', JSON.stringify(res.data))
    } catch (err) {
      console.error('Failed to fetch profile', err)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    const res = await API.post('/auth/login/', { username, password })
    const { user, tokens } = res.data
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('user_info', JSON.stringify(user))
    setUser(user)
    return user
  }

  const loginAsDemo = async (role) => {
    let credentials = { username: 'seeker@gmail.com', password: 'seeker123' }
    if (role === 'EMPLOYER') {
      credentials = { username: 'employer@techcorp.com', password: 'employer123' }
    } else if (role === 'ADMIN') {
      credentials = { username: 'admin@jobconnect.com', password: 'admin123' }
    }
    return await login(credentials.username, credentials.password)
  }

  const register = async (userData) => {
    const res = await API.post('/auth/register/', userData)
    const { user, tokens } = res.data
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('user_info', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
    setUser(null)
  }

  const updateProfile = async (data) => {
    const res = await API.put('/profile/', data)
    setUser(res.data.user)
    localStorage.setItem('user_info', JSON.stringify(res.data.user))
    return res.data
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginAsDemo,
      register,
      logout,
      updateProfile,
      fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
