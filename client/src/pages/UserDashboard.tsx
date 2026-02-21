import { useState, useEffect } from 'react'
import { User, DollarSign, Clock, LogOut, History, Plus } from 'lucide-react'
import apiService from '../services/api'

interface User {
  id: string
  phone: string
  balance: number
  createdAt: string
}

interface Session {
  _id: string
  computerId: string
  startTime: string
  endTime?: string
  cost: number
  status: string
}

export default function UserDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [balance, setBalance] = useState(user.balance)
  const [history, setHistory] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [topUpAmount, setTopUpAmount] = useState('')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const [balanceData, historyData] = await Promise.all([
        apiService.getUserBalance(),
        apiService.getUserHistory()
      ])
      setBalance(balanceData.balance)
      setHistory(historyData)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return
    
    try {
      // This would need to be implemented on backend
      // await apiService.topUpBalance(parseFloat(topUpAmount))
      setBalance(prev => prev + parseFloat(topUpAmount))
      setTopUpAmount('')
    } catch (error) {
      console.error('Error topping up balance:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Личный кабинет</h1>
                <p className="text-gray-300">{user.phone}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Баланс</h2>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-4">
              {balance.toLocaleString()} ₸
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Сумма пополнения"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleTopUp}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Пополнить</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Статистика</h2>
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Всего сессий:</span>
                <span className="text-white font-medium">{history.length}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Активных сессий:</span>
                <span className="text-green-400 font-medium">
                  {history.filter(s => s.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Общая сумма:</span>
                <span className="text-white font-medium">
                  {history.reduce((sum, s) => sum + s.cost, 0).toLocaleString()} ₸
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <History className="w-6 h-6 text-purple-400" />
              <span>История сессий</span>
            </h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">У вас пока нет сессий</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((session) => (
                <div
                  key={session._id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Компьютер {session.computerId}</p>
                      <p className="text-gray-400 text-sm">
                        {formatDate(session.startTime)}
                        {session.endTime && ` - ${formatDate(session.endTime)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        session.status === 'active' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {session.status === 'active' ? 'Активна' : 'Завершена'}
                      </p>
                      <p className="text-white font-semibold">{session.cost} ₸</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
