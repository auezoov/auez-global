import { useState, useEffect } from 'react'
import { LogOut, Bell, Clock, DollarSign, Gamepad2, Headphones, Coffee } from 'lucide-react'
import api from '../services/api'
import realtime from '../services/realtime'
import LockScreen from './LockScreen'
import TimesUpScreen from './TimesUpScreen'
import SystemStatus from './SystemStatus'

interface ClientDashboardProps {
  username: string
  onLogout: () => void
}

export default function ClientDashboard({ username, onLogout }: ClientDashboardProps) {
  const [balance, setBalance] = useState(77777)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isCallingAdmin, setIsCallingAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeSession, setActiveSession] = useState<{id: number} | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [serverStatus, setServerStatus] = useState<'online' | 'offline'>('offline')
  const [isLocked, setIsLocked] = useState(false)
  const [initialTime, setInitialTime] = useState(0)
  const userId = 1

  useEffect(() => {
    // Load shop items
    const loadShopItems = async () => {
      try {
        const items = await api.getShopItems()
        console.log('Shop items loaded:', items)
      } catch (error) {
        console.error('Failed to load shop items:', error)
      }
    }
    loadShopItems()

    // Set up real-time listeners
    realtime.on('session_started', (data: any) => {
      console.log('📱 Real-time session update:', data)
      if (data.userId === userId || data.userId === 1) {
        setBalance(data.newBalance)
        setTimeRemaining(data.duration)
        setInitialTime(data.duration)
        setActiveSession({ id: data.sessionId })
        setError(null)
      }
    })

    realtime.on('balance_updated', (data: any) => {
      console.log('📱 Real-time balance update:', data)
      if (data.userId === userId || data.userId === 1) {
        setBalance(data.newBalance)
      }
    })

    return () => {
      realtime.off('session_started', () => {})
      realtime.off('balance_updated', () => {})
    }
  }, [userId])

  useEffect(() => {
    // Heartbeat check every 5 seconds
    const heartbeatInterval = setInterval(async () => {
      try {
        const heartbeat = await api.heartbeat()
        if (heartbeat.success) {
          setServerStatus('online')
          setError(null)
        } else {
          setServerStatus('online')
          setError(heartbeat.message || 'Server connection issue')
        }
      } catch (error) {
        setServerStatus('offline')
        setError('Server Offline - Attempting to reconnect...')
      }
    }, 5000)

    return () => clearInterval(heartbeatInterval)
  }, [])

  useEffect(() => {
    // Load real balance and check for active session
    const loadData = async () => {
      try {
        console.log('🔄 Loading user data...')
        const realBalance = await api.getUserBalance()
        console.log('💰 Loaded balance:', realBalance)
        setBalance(realBalance)
        
        // Check for active session
        const sessionData = await api.getActiveSession(userId)
        if (sessionData.success && sessionData.session) {
          setActiveSession(sessionData.session)
          setTimeRemaining(sessionData.session.remaining)
          setInitialTime(sessionData.session.remaining)
        }
      } catch (error) {
        console.error('API Error:', error)
        // KEEP USER ON PAGE - DO NOT LOG OUT
        setBalance(77777) // Set fallback balance
        setError('API Error - balance set to 77777')
      }
    }
    loadData()
  }, [userId])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto-lock when time is up
  useEffect(() => {
    if (timeRemaining === 0 && initialTime > 0) {
      setIsLocked(true)
    }
  }, [timeRemaining, initialTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleUnlock = () => {
    setIsLocked(false)
  }

  const handleTopUpBalance = async () => {
    const amount = prompt('Введите сумму для пополнения баланса:')
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      setIsLoading(true)
      try {
        const result = await api.topUpBalance(userId, Number(amount))
        if (result.success) {
          setBalance(result.newBalance)
          
          // Broadcast real-time update
          realtime.send('balance_updated', {
            userId,
            newBalance: result.newBalance,
            amount: result.amount,
            type: 'topup'
          })
          
          alert(`Баланс успешно пополнен на ${result.amount} ₸`)
        }
      } catch (error) {
        console.error('Failed to top up balance:', error)
        alert('Не удалось пополнить баланс. Попробуйте еще раз.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePurchaseItem = async (itemId: number, price: number) => {
    if (balance < price) {
      alert('Недостаточно средств на балансе!')
      return
    }

    setIsLoading(true)
    try {
      const result = await api.purchaseItem(userId, itemId, 1)
      if (result.success) {
        setBalance(result.newBalance)
        
        // Broadcast real-time update
        realtime.send('balance_updated', {
          userId,
          newBalance: result.newBalance,
          item: result.item,
          cost: result.totalCost,
          type: 'purchase'
        })
        
        alert(`Покупка успешна: ${result.item} за ${result.totalCost} ₸`)
      }
    } catch (error) {
      console.error('Failed to purchase item:', error)
      alert('Не удалось совершить покупку. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  const callAdmin = async () => {
    setIsCallingAdmin(true)
    try {
      await api.callAdmin(`${username} вызывает администратора`)
      alert('Администратор уведомлен! Он придет к вам через несколько минут.')
    } catch (error) {
      console.error('Failed to call admin:', error)
      alert('Не удалось вызвать администратора. Попробуйте еще раз.')
    } finally {
      setIsCallingAdmin(false)
    }
  }

  const handleStartSession = async () => {
    if (serverStatus !== 'online') {
      setError('Cannot start session while server is offline')
      return
    }

    if (balance < 500) {
      setError('Недостаточно средств! Минимальная стоимость: 500 ₸')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await api.startSession(userId, 1) // 1 hour session
      if (result.success) {
        setBalance(result.newBalance)
        setTimeRemaining(3600) // 1 hour in seconds
        setInitialTime(3600)
        setActiveSession({ id: result.sessionId })
        setError(null)
        alert(`Сессия запущена! Списано: ${result.cost} ₸`)
      }
    } catch (error) {
      console.error('Failed to start session:', error)
      setError('Не удалось запустить сессию. Проверьте подключение к серверу.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTime = async (amount: number, cost: number) => {
    if (balance < cost) {
      alert('Недостаточно средств на балансе!')
      return
    }

    setIsLoading(true)
    try {
      const result = await api.startSession(userId, amount / 3600) // Convert seconds to hours
      if (result.success) {
        setBalance(result.newBalance)
        setTimeRemaining(prev => prev + amount)
        setInitialTime(prev => prev + amount)
        setIsLocked(false) // Unlock if time was up
        alert(`Время успешно добавлено! Списано: ${cost} ₸`)
      }
    } catch (error) {
      console.error('Failed to add time:', error)
      alert('Не удалось добавить время. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Server Status Overlay */}
      {serverStatus !== 'online' && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800 border border-red-500/50 rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              {serverStatus === 'offline' && (
                <>
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Server Offline</h3>
                  <p className="text-slate-300 mb-4">Сервер недоступен. Проверьте подключение.</p>
                </>
              )}
              {serverStatus === 'offline' && (
                <>
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Reconnecting...</h3>
                  <p className="text-slate-300 mb-4">Попытка подключения к серверу...</p>
                </>
              )}
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content - Only show when server is online */}
      <SystemStatus />
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {isLocked ? (
        <LockScreen username={username} onUnlock={handleUnlock} timeRemaining={timeRemaining} />
      ) : timeRemaining === 0 && initialTime > 0 ? (
        <TimesUpScreen username={username} balance={balance} onAddTime={handleAddTime} onLogout={onLogout} />
      ) : (
        <div className="relative z-10">
          {/* Header */}
          <div className="bg-slate-900/50 backdrop-blur-sm border-b border-purple-500/30">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2">
                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                    <h1 className="text-xl font-bold text-white">AUEZ</h1>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500">Игрок:</span>{' '}
                    <span className="text-purple-400 font-medium">{username}</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Выход</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timer Section */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Оставшееся время</h2>
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-50"></div>
                      <div className="relative bg-slate-900 border-2 border-purple-500 rounded-2xl px-8 py-6">
                        <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                          {formatTime(timeRemaining)}
                        </div>
                      </div>
                    </div>
                    {timeRemaining === 0 && (
                      <div className="mt-4 text-red-400 font-medium">
                        Время истекло! Пополните баланс для продолжения.
                      </div>
                    )}
                  </div>

                  {/* Error Display */}
                  {error && serverStatus === 'online' && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* TEST: 1 MINUTE Button */}
                  <button
                    onClick={() => handleStartSession()}
                    disabled={balance < 500 || isLoading}
                    className="w-full mb-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/25"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <Clock className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-lg">TEST: 1 MINUTE</div>
                        <div className="text-sm opacity-90">500 ₸</div>
                      </>
                    )}
                  </button>

                  {/* Start Session Button */}
                  {!activeSession && (
                    <button
                      onClick={handleStartSession}
                      disabled={balance < 500 || isLoading}
                      className="w-full mb-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Запуск...</span>
                        </div>
                      ) : (
                        <>
                          <Clock className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-lg">Запустить сессию (1 час)</div>
                          <div className="text-sm opacity-90">500 ₸</div>
                        </>
                      )}
                    </button>
                  )}

                  {/* Time Packages */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleAddTime(3600, 500)}
                      disabled={balance < 500 || isLoading}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-4 rounded-xl transition-all transform hover:scale-105"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <>
                          <Clock className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-lg">+1 час</div>
                          <div className="text-sm opacity-90">500 ₸</div>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleAddTime(10800, 1500)}
                      disabled={balance < 1500 || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-4 rounded-xl transition-all transform hover:scale-105"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <>
                          <Clock className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-lg">+3 часа</div>
                          <div className="text-sm opacity-90">1,500 ₸</div>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleAddTime(32400, 4500)}
                      disabled={balance < 4500 || isLoading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-4 rounded-xl transition-all transform hover:scale-105"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <>
                          <Clock className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-lg">+9 часов</div>
                          <div className="text-sm opacity-90">4,500 ₸</div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Balance */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Мой баланс</h3>
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {balance.toLocaleString()} ₸
                  </div>
                  <button 
                    onClick={handleTopUpBalance}
                    disabled={isLoading}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {isLoading ? 'Загрузка...' : 'Пополнить баланс'}
                  </button>
                </div>

                {/* Services */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Дополнительные услуги</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handlePurchaseItem(1, 200)}
                      disabled={balance < 200 || isLoading}
                      className="w-full flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Headphones className="w-4 h-4 text-purple-400" />
                        <span>Наушники</span>
                      </div>
                      <span className="text-sm text-slate-400">200 ₸</span>
                    </button>
                    <button 
                      onClick={() => handlePurchaseItem(2, 500)}
                      disabled={balance < 500 || isLoading}
                      className="w-full flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Coffee className="w-4 h-4 text-purple-400" />
                        <span>Напиток</span>
                      </div>
                      <span className="text-sm text-slate-400">500 ₸</span>
                    </button>
                  </div>
                </div>

                {/* Call Admin */}
                <button
                  onClick={callAdmin}
                  disabled={isCallingAdmin}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-red-500/25 flex items-center justify-center space-x-3"
                >
                  <Bell className="w-5 h-5" />
                  <span>{isCallingAdmin ? 'Вызов отправлен...' : 'Вызвать администратора'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
