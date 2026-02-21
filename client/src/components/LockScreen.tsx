import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Clock } from 'lucide-react'

interface LockScreenProps {
  username: string
  onUnlock: () => void
  timeRemaining: number
}

export default function LockScreen({ username, onUnlock, timeRemaining }: LockScreenProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLocked, setIsLocked] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(timeRemaining)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            setIsLocked(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Введите пароль для разблокировки')
      return
    }

    try {
      // In a real app, this would verify the user's password
      // For now, we'll accept any password to unlock
      setIsLocked(false)
      onUnlock()
    } catch (error) {
      setError('Неверный пароль')
    }
  }

  if (!isLocked) {
    return null // Don't render if unlocked
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mb-4">
            <Lock className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-bold text-white">Экран блокировки</span>
          </div>
          <p className="text-slate-300">Компьютер заблокирован</p>
          <p className="text-purple-400 font-medium">{username}</p>
        </div>

        {/* Time Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Осталось времени:</span>
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-2">
            {formatTime(timeLeft)}
          </div>
          {timeLeft === 0 && (
            <div className="mt-2 text-red-400 font-medium">
              Время истекло!
            </div>
          )}
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 font-medium mb-2 block">
              Пароль для разблокировки
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
          >
            Разблокировать
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">
            Для продолжения работы введите пароль
          </p>
        </div>
      </div>
    </div>
  )
}
