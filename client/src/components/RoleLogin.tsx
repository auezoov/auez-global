import { useState } from 'react'
import { Monitor, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import api from '../services/api'

interface RoleLoginProps {
  onLogin: (user: any, role: string) => void
}

export default function RoleLogin({ onLogin }: RoleLoginProps) {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'client' | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !username || !password) {
      setError('Заполните все поля')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await api.authLogin(username, password)
      if (result.success) {
        onLogin(result.user, result.redirect)
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка входа')
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (role: 'admin' | 'client', user: string, pass: string) => {
    setSelectedRole(role)
    setUsername(user)
    setPassword(pass)
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement
      if (form) form.requestSubmit()
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 bg-purple-500/10 border border-purple-500/30 rounded-xl px-6 py-3 inline-block">
            <Monitor className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AUEZ
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">Система входа</h2>
          <p className="text-slate-400 mt-2">Выберите вашу роль для входа в систему</p>
        </div>

        {/* Role Selection */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setSelectedRole('admin')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'admin'
                  ? 'border-purple-500 bg-purple-500/10 text-white'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-purple-500/50 hover:text-white'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Администратор</div>
              <div className="text-xs opacity-75 mt-1">Панель управления</div>
            </button>
            <button
              onClick={() => setSelectedRole('client')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'client'
                  ? 'border-cyan-500 bg-cyan-500/10 text-white'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-cyan-500/50 hover:text-white'
              }`}
            >
              <Monitor className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Клиент</div>
              <div className="text-xs opacity-75 mt-1">Личный кабинет</div>
            </button>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500 mb-2">Быстрый вход:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickLogin('admin', 'admin', 'admin')}
                className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 text-xs transition-colors"
              >
                admin/admin
              </button>
              <button
                onClick={() => quickLogin('client', 'client', 'client')}
                className="px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs transition-colors"
              >
                client/client
              </button>
            </div>
          </div>
        </div>

        {/* Login Form */}
        {selectedRole && (
          <form onSubmit={handleLogin} id="login-form" className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Имя пользователя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:bg-slate-800/70 transition-colors"
                    placeholder={selectedRole === 'admin' ? 'admin' : 'client'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:bg-slate-800/70 transition-colors"
                    placeholder={selectedRole === 'admin' ? 'admin' : 'client'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Вход...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Войти в систему</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
