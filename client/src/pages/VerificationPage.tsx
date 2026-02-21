import { useState } from 'react'
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react'
import apiService from '../services/api'

interface VerificationPageProps {
  phone: string
  onVerified: (token: string, user: any) => void
  onBack: () => void
}

export default function VerificationPage({ phone, onVerified, onBack }: VerificationPageProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) {
      setError('Введите код подтверждения')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await apiService.verifyCode(phone, code)
      onVerified(result.token, result.user)
    } catch (err) {
      setError('Неверный код подтверждения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="mb-4 text-gray-300 hover:text-white transition-colors flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Подтверждение</h1>
          <p className="text-gray-300">Введите код из SMS для номера {phone}</p>
          <p className="text-gray-400 text-sm mt-1">Тестовый код: 1234</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Код подтверждения
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="1234"
              maxLength={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Проверка...</span>
            ) : (
              <>
                <span>Подтвердить</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
