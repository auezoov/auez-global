import { useState } from 'react'
import { User, Lock, Eye, EyeOff, Gamepad2 } from 'lucide-react'
import api from '../services/api'

interface LoginScreenProps {
  onLogin?: (username: string) => void
}

export default function LoginScreen(props: LoginScreenProps) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim() || !password.trim()) {
      setError('Введите телефон и пароль')
      return
    }

    setIsLoading(true)
    setError('')
    
    // Retry logic - try 3 times automatically
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await api.login(phone.trim(), password.trim())
        console.log('🔐 Login successful, saving to localStorage:', phone.trim())
        
        // Save to localStorage for persistence
        localStorage.setItem('clientUsername', phone.trim())
        localStorage.setItem('loginTime', Date.now().toString())
        
        // Call onLogin if provided
        if (props.onLogin) {
          props.onLogin(phone.trim())
        }
        
        // Direct redirect to force page change even if router glitches
        window.location.href = '/dashboard'
        return // Success - exit function
      } catch (error) {
        console.log(`Login attempt ${attempt} failed:`, error)
        if (attempt === 3) {
          setError('Неверный телефон или пароль')
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AUEZ
            </h1>
          </div>
          <p className="text-slate-400 mt-4">Личный кабинет игрока</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">
                Телефон
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Введите номер телефона"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !phone.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Вход...</span>
                </div>
              ) : (
                'Войти в кабинет'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setPhone('777')
                setPassword('777')
                setError('')
              }}
              className="mb-3 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              🎮 DEMO LOGIN (Админ)
            </button>
            <p className="text-slate-400 text-sm">
              Нет аккаунта?{' '}
              <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Зарегистрироваться
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-xs">
            © 2024 AUEZ Gaming Club. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  )
}
