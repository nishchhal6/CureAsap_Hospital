import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Hospital, Lock, Mail, Shield } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Mock authentication - simulate API call
    setTimeout(() => {
      // Demo credentials: email: "admin@cureasap.com", password: "hospital123"
      if (formData.email === 'admin@cureasap.com' && formData.password === 'hospital123') {
        localStorage.setItem('hospitalAuth', 'loggedin')
        navigate('/')
      } else {
        setError('Invalid email or password')
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-red-600 rounded-2xl flex items-center justify-center shadow-xl mb-6">
            <Hospital className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-navy to-slate-700 bg-clip-text text-transparent mb-3">
            CureAsap Hospital
          </h1>
          <p className="text-gray-600 text-lg">Emergency Response Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-navy mb-3">
                Hospital Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@cureasap.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary text-navy placeholder-gray-500 transition-all duration-200 text-lg font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="hospital123"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary text-navy placeholder-gray-500 transition-all duration-200 text-lg font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 text-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Login Securely</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <div className="text-xs bg-slate-100 p-3 rounded-xl">
              <p><span className="font-semibold">Email:</span> admin@cureasap.com</p>
              <p><span className="font-semibold">Password:</span> hospital123</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            © 2026 CureAsap Hospital System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
