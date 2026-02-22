import { useState, useEffect } from 'react'
import { LogOut, Monitor, User } from 'lucide-react'
import api from '../services/api'

type Language = 'RU' | 'EN' | 'KZ'

const translations = {
  RU: {
    balance: 'Баланс',
    available: 'Свободно',
    occupied: 'Занято',
    computerHall: 'Компьютерный зал',
    welcome: 'Добро пожаловать',
    logout: 'Выйти'
  },
  EN: {
    balance: 'Balance',
    available: 'Available',
    occupied: 'Occupied',
    computerHall: 'Computer Hall',
    welcome: 'Welcome',
    logout: 'Logout'
  },
  KZ: {
    balance: 'Баланс',
    available: 'Бос',
    occupied: 'Бос емес',
    computerHall: 'Компьютер залы',
    welcome: 'Қош келдіңіз',
    logout: 'Шығу'
  }
}

export default function ClientDashboard() {
  const [balance, setBalance] = useState(5000)
  const [language, setLanguage] = useState<Language>('RU')
  const [userName] = useState('Player')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language
    if (savedLanguage && ['RU', 'EN', 'KZ'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }

    // Load user balance
    const loadBalance = async () => {
      try {
        const balanceData = await api.getUserBalance()
        setBalance(balanceData.balance)
      } catch (error) {
        console.error('Failed to load balance:', error)
      }
    }
    loadBalance()

    // Load active session
    const loadSession = async () => {
      try {
        const sessionData = await api.getActiveSession(1)
        console.log('Session data:', sessionData)
      } catch (error) {
        console.error('Failed to load session:', error)
      }
    }
    loadSession()
  }, [])

  const t = translations[language]

  // Mock computer data - 7 available, 3 occupied
  const computers = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    status: i < 7 ? 'available' : 'occupied',
    name: `PC ${i + 1}`
  }))

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Top Bar */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold">{userName}</h2>
                <p className="text-cyan-400 font-bold">{t.balance}: {balance.toLocaleString()} ₸</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              {t.logout}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.welcome}, {userName}!</h1>
          <p className="text-gray-300">{t.computerHall}</p>
        </div>

        {/* Computer Grid */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Cyan Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none rounded-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">{t.computerHall}</h3>
            
            <div className="grid grid-cols-5 gap-4">
              {computers.map((computer) => (
                <div
                  key={computer.id}
                  className={`relative group transition-all duration-300 hover:scale-105 ${
                    computer.status === 'available' 
                      ? 'cursor-pointer' 
                      : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                    computer.status === 'available'
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/25'
                      : 'bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-400/50'
                  }`}>
                    <Monitor className={`w-8 h-8 mb-2 ${
                      computer.status === 'available' ? 'text-green-400' : 'text-red-400'
                    }`} />
                    <span className="text-white font-semibold text-sm">{computer.name}</span>
                    <span className={`text-xs mt-1 ${
                      computer.status === 'available' ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {computer.status === 'available' ? t.available : t.occupied}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/30 border border-green-400/50 rounded"></div>
                <span className="text-gray-300 text-sm">{t.available}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/30 border border-red-400/50 rounded"></div>
                <span className="text-gray-300 text-sm">{t.occupied}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
