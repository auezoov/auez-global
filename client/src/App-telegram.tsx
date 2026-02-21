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
import TelegramLogin from './components/TelegramLogin'
import apiService from './services/api'

function App() {
  const [activeTab, setActiveTab] = useState('computers')
  const [activeAdmin] = useState('Ерлан')
  const [isClientView, setIsClientView] = useState(false)
  const [clientUsername, setClientUsername] = useState('')
  const [clubName, setClubName] = useState('AUEZ GLOBAL')
  const [showRoleLogin, setShowRoleLogin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = apiService.getToken()
    if (token) {
      setIsAuthenticated(true)
      setIsClientView(true)
    }
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
    apiService.clearToken()
  }

  // If not authenticated, show Telegram login
  if (!isAuthenticated) {
    return <TelegramLogin />
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
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{clubName}</h1>
              <p className="text-gray-400 text-sm">Административная панель</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{activeAdmin}</p>
              <p className="text-gray-400 text-sm">Администратор</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBusinessTabs = () => (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="px-6">
        <div className="flex space-x-8">
          {businessTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? `border-blue-500 text-white`
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : ''}`} />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBusinessContent = () => {
    switch (activeTab) {
      case 'computers':
        return <ComputerList />
      case 'finance':
        return <FinanceDashboard />
      case 'shifts':
        return <ShiftManager />
      case 'notifications':
        return <Notifications />
      case 'settings':
        return <Settings />
      default:
        return <ComputerList />
    }
  }

  const renderClientView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{clubName}</h1>
                <p className="text-blue-200 text-sm">Клиентский портал</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
      <ClientDashboard />
    </div>
  )

  const renderBusinessView = () => (
    <div className="min-h-screen bg-gray-900">
      {renderBusinessHeader()}
      {renderBusinessTabs()}
      <div className="p-6">
        {renderBusinessContent()}
      </div>
    </div>
  )

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <AdminNotification />
        {isClientView ? renderClientView() : renderBusinessView()}
      </div>
    </ErrorBoundary>
  )
}

export default App
