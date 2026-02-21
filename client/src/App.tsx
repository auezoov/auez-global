import { useState, useEffect } from 'react'
import { Monitor, DollarSign, Clock, AlertCircle, Settings as SettingsIcon, Zap } from 'lucide-react'
import PCMap from './components/PCMap'
import FinanceDashboard from './components/FinanceDashboard'
import ShiftManager from './components/ShiftManager'
import Notifications from './components/Notifications'
import ClientDashboard from './components/ClientDashboard'
import Settings from './components/Settings'
import ErrorBoundary from './components/ErrorBoundary'
import AdminNotification from './components/AdminNotification'
import RoleLogin from './components/RoleLogin'
import ComputerList from './components/ComputerList'

function App() {
  const [activeTab, setActiveTab] = useState('computers')
  const [activeAdmin] = useState('Ерлан')
  const [isClientView, setIsClientView] = useState(false)
  const [clientUsername, setClientUsername] = useState('')
  const [clubName, setClubName] = useState('AUEZ GLOBAL')
  const [showRoleLogin, setShowRoleLogin] = useState(false)

  // Business metrics
  const [metrics, setMetrics] = useState({
    todayRevenue: 45600,
    activeUsers: 24,
    totalSessions: 156,
    avgSessionTime: '2h 15m',
    occupancyRate: 85
  })

  // Check localStorage on mount for persistent login
  useEffect(() => {
    const savedUsername = localStorage.getItem('clientUsername')
    const savedLoginTime = localStorage.getItem('loginTime')
    
    if (savedUsername && savedLoginTime) {
      const loginAge = Date.now() - parseInt(savedLoginTime)
      // Keep login for 24 hours
      if (loginAge < 24 * 60 * 60 * 1000) {
        setClientUsername(savedUsername)
        setIsClientView(true)
      } else {
        localStorage.removeItem('clientUsername')
        localStorage.removeItem('loginTime')
      }
    }

    // Load club settings
    const savedClubName = localStorage.getItem('clubName')
    if (savedClubName) setClubName(savedClubName)

    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 1000),
        activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        totalSessions: prev.totalSessions + Math.floor(Math.random() * 2),
        occupancyRate: Math.min(100, Math.max(0, prev.occupancyRate + Math.floor(Math.random() * 5) - 2))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogin = (username: string, role: string) => {
    if (role === 'client') {
      setClientUsername(username)
      setIsClientView(true)
      localStorage.setItem('clientUsername', username)
      localStorage.setItem('loginTime', Date.now().toString())
    }
    setShowRoleLogin(false)
  }

  const handleLogout = () => {
    setIsClientView(false)
    setClientUsername('')
    localStorage.removeItem('clientUsername')
    localStorage.removeItem('loginTime')
  }

  const businessTabs = [
    { id: 'computers', name: 'Компьютеры', icon: Monitor, color: 'text-blue-400' },
    { id: 'finance', name: 'Финансы', icon: DollarSign, color: 'text-green-400' },
    { id: 'shifts', name: 'Смены', icon: Clock, color: 'text-purple-400' },
    { id: 'notifications', name: 'Уведомления', icon: AlertCircle, color: 'text-yellow-400' },
    { id: 'settings', name: 'Настройки', icon: SettingsIcon, color: 'text-gray-400' }
  ]

  const renderBusinessHeader = () => (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{clubName}</h1>
                <p className="text-gray-400 text-sm">Система управления интернет-клубом</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Сегодня</p>
                <p className="text-green-400 font-bold text-lg">{metrics.todayRevenue.toLocaleString()} ₸</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">Активно</p>
                <p className="text-blue-400 font-bold text-lg">{metrics.activeUsers}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">Сессий</p>
                <p className="text-purple-400 font-bold text-lg">{metrics.totalSessions}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">Заполнение</p>
                <p className="text-yellow-400 font-bold text-lg">{metrics.occupancyRate}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Онлайн</span>
              </div>
              <div className="text-white">
                <p className="text-sm font-medium">{activeAdmin}</p>
                <p className="text-gray-400 text-xs">Администратор</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBusinessTabs = () => (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="px-6">
        <div className="flex space-x-1">
          {businessTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white border-t-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  if (showRoleLogin) {
    return <RoleLogin onLogin={handleLogin} />
  }

  if (isClientView) {
    return <ClientDashboard username={clientUsername} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {renderBusinessHeader()}
      {renderBusinessTabs()}
      
      <div className="p-6">
        <ErrorBoundary>
          {activeTab === 'computers' && <ComputerList />}
          {activeTab === 'finance' && <FinanceDashboard />}
          {activeTab === 'shifts' && <ShiftManager />}
          {activeTab === 'notifications' && <Notifications />}
          {activeTab === 'settings' && <Settings />}
        </ErrorBoundary>
      </div>

      <AdminNotification 
        onOpen={() => setShowRoleLogin(true)}
        onClose={() => setShowRoleLogin(false)}
      />
    </div>
  )
}

export default App
