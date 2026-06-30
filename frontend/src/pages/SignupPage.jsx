import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function SignupPage({ onSwitchToLogin }) {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      return setError('Passwords do not match.')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow--1" />
      <div className="auth-glow auth-glow--2" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__icon">✦</div>
          <span className="auth-logo__text">TaskFlow</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start managing your tasks privately and securely</p>

        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              className="auth-input"
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              className="auth-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              className="auth-input"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-confirm">Confirm password</label>
            <input
              id="signup-confirm"
              className="auth-input"
              type="password"
              name="confirm"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            id="btn-signup"
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button className="auth-switch__link" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
