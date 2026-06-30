import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // true while checking localStorage

  // On app load: restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('taskflow_token')
    const savedUser = localStorage.getItem('taskflow_user')
    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setToken(savedToken)
      setUser(parsedUser)
      // Set axios default Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
    setLoading(false)
  }, [])

  // Called after successful login or register
  const saveSession = (token, user) => {
    setToken(token)
    setUser(user)
    localStorage.setItem('taskflow_token', token)
    localStorage.setItem('taskflow_user', JSON.stringify(user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Register new account
  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password })
    saveSession(res.data.token, res.data.user)
    return res.data
  }

  // Login with existing account
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password })
    saveSession(res.data.token, res.data.user)
    return res.data
  }

  // Logout — clear everything
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('taskflow_token')
    localStorage.removeItem('taskflow_user')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy usage
export const useAuth = () => useContext(AuthContext)
