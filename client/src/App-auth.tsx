import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import VerificationPage from './pages/VerificationPage'
import UserDashboard from './pages/UserDashboard'
import apiService from './services/api'

interface User {
  id: string
  phone: string
  balance: number
  createdAt: string
}

type AuthView = 'login' | 'verification' | 'dashboard'

function AppAuth() {
  const [currentView, setCurrentView] = useState<AuthView>('login')
  const [phone, setPhone] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = apiService.getToken()
    if (token) {
      // Verify token and get user data
      apiService.getUserProfile()
        .then((userData) => {
          setUser(userData)
          setCurrentView('dashboard')
        })
        .catch(() => {
          apiService.clearToken()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const handlePhoneSubmit = (submittedPhone: string) => {
    setPhone(submittedPhone)
    setCurrentView('verification')
  }

  const handleVerified = (token: string, userData: User) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleBackToLogin = () => {
    setCurrentView('login')
    setPhone('')
  }

  const handleLogout = () => {
    apiService.clearToken()
    setUser(null)
    setCurrentView('login')
    setPhone('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    )
  }

  switch (currentView) {
    case 'login':
      return <LoginPage onPhoneSubmit={handlePhoneSubmit} />
    case 'verification':
      return (
        <VerificationPage
          phone={phone}
          onVerified={handleVerified}
          onBack={handleBackToLogin}
        />
      )
    case 'dashboard':
      return user ? (
        <UserDashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onPhoneSubmit={handlePhoneSubmit} />
      )
    default:
      return <LoginPage onPhoneSubmit={handlePhoneSubmit} />
  }
}

export default AppAuth
