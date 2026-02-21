import { useState, useEffect, useMemo } from 'react'
import { Monitor, DollarSign, Users, Clock, CheckCircle, AlertCircle, Settings as SettingsIcon, Home } from 'lucide-react'
import PCMap from './components/PCMap'
import FinanceDashboard from './components/FinanceDashboard'
import ShiftManager from './components/ShiftManager'
import Notifications from './components/Notifications'
import QuickSearch from './components/QuickSearch'
import ClientDashboard from './components/ClientDashboard'
import Settings from './components/Settings'
import LandingPage from './components/LandingPage'
import LiveLog from './components/LiveLog'
import ErrorBoundary from './components/ErrorBoundary'
import AdminNotification from './components/AdminNotification'
import RoleLogin from './components/RoleLogin'
import api from './services/api'

interface Computer {
  id: string
  status: 'online' | 'offline' | 'maintenance'
  timeRemaining: string
}

function App() {
  const [activeTab, setActiveTab] = useState('computers')
  const [isShiftOpen, setIsShiftOpen] = useState(false)
  const [activeAdmin] = useState('Ерлан')
  const [isClientView, setIsClientView] = useState(false)
  const [clientUsername, setClientUsername] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [clubName, setClubName] = useState('AUEZ')
  const [logoUrl, setLogoUrl] = useState('')
  const [pcStatus, setPcStatus] = useState<{[key: string]: 'online' | 'offline'}>({
    'PC-001': 'offline',
    'PC-002': 'offline',
    'PC-003': 'offline',
    'PC-004': 'offline',
    'PC-005': 'offline',
    'PC-006': 'offline'
  })
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showRoleLogin, setShowRoleLogin] = useState(false)

  // Check localStorage on mount for persistent login
  useEffect(() => {
    const savedUsername = localStorage.getItem('clientUsername')
    const savedLoginTime = localStorage.getItem('loginTime')
    
    if (savedUsername && savedLoginTime) {
      const loginAge = Date.now() - parseInt(savedLoginTime)
      // Keep login for 24 hours
      if (loginAge < 24 * 60 * 60 * 1000) {
        console.log('🔐 Restoring session from localStorage:', savedUsername)
        setClientUsername(savedUsername)
        setIsClientView(true)
      } else {
        console.log('🕐 Session expired, clearing localStorage')
        localStorage.removeItem('clientUsername')
        localStorage.removeItem('loginTime')
      }
    }
  }, [])

  const computers: Computer[] = useMemo(() => [
    { id: 'PC-001', status: pcStatus['PC-001'] || 'offline', timeRemaining: pcStatus['PC-001'] === 'online' ? '1h 00m' : '0m' },
    { id: 'PC-002', status: pcStatus['PC-002'] || 'offline', timeRemaining: '0m' },
    { id: 'PC-003', status: pcStatus['PC-003'] || 'offline', timeRemaining: '0m' },
    { id: 'PC-004', status: pcStatus['PC-004'] || 'offline', timeRemaining: '0m' },
    { id: 'PC-005', status: pcStatus['PC-005'] || 'offline', timeRemaining: '0m' },
    { id: 'PC-006', status: pcStatus['PC-006'] || 'offline', timeRemaining: '0m' },
  ], [pcStatus])
  
  // Notification state lifted up to control logo pulsing
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'warning' as const,
      title: 'Время истекает',
      message: 'У ПК-005 заканчивается время (5 мин)',
      time: '2 мин назад',
      read: false
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Новый клиент',
      message: 'Новый клиент зарегистрирован: Данияр К.',
      time: '10 мин назад',
      read: false
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'Система',
      message: 'VIP комната готова к приему клиентов',
      time: '15 мин назад',
      read: true
    }
  ])
  
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])
  const hasUnreadNotifications = unreadCount > 0
  
  // Auto-refresh PC status when session starts
  useEffect(() => {
    let isMounted = true
    
    const checkPcStatus = setInterval(() => {
      if (!isMounted) return
      
      fetch('/api/session/active?userId=1')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.session && isMounted) {
            // PC-001 becomes occupied when user 777 starts session
            setPcStatus(prev => ({
              ...prev,
              'PC-001': 'online'
            }))
          }
        })
        .catch(err => {
          if (isMounted) console.log('PC status check failed:', err)
        })
    }, 3000) // Check every 3 seconds

    return () => {
      isMounted = false
      clearInterval(checkPcStatus)
    }
  }, [])

  const handleOpenShift = () => setIsShiftOpen(true)
  const handleCloseShift = () => setIsShiftOpen(false)
  const handleClubNameChange = (name: string) => setClubName(name)
  const handleLogoChange = (url: string) => setLogoUrl(url)

  const sidebarItems = useMemo(() => [
    { icon: Home, label: 'Главная', id: 'landing' },
    { icon: Monitor, label: 'Компьютеры', id: 'computers' },
    { icon: DollarSign, label: 'Финансы', id: 'finance' },
    { icon: Users, label: 'Клиенты', id: 'users' },
    { icon: Clock, label: 'Смена', id: 'shift' },
    { icon: SettingsIcon, label: 'Настройки', id: 'settings' },
  ], [])

  const handleRoleLogin = (user: any, redirect: string) => {
    console.log('🔐 Role login successful:', user, 'redirect:', redirect)
    setCurrentUser(user)
    api.setToken(user.token)
    
    if (redirect === 'control-panel') {
      setIsClientView(false)
      setActiveTab('computers')
    } else if (redirect === 'dashboard') {
      setClientUsername(user.username)
      setIsClientView(true)
    }
    setShowRoleLogin(false)
  }

  const handleLogout = () => {
    console.log('🚪 Logging out')
    setCurrentUser(null)
    setIsClientView(false)
    setClientUsername('')
    api.clearToken()
    localStorage.removeItem('clientUsername')
    localStorage.removeItem('loginTime')
    setShowRoleLogin(true)
  }

  const toggleView = () => {
    if (isClientView) {
      handleLogout()
    } else {
      setShowRoleLogin(true)
    }
  }

  const getStatusColor = (status: Computer['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-400/10'
      case 'offline':
        return 'text-red-400 bg-red-400/10'
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-400/10'
    }
  }

  const getStatusIcon = (status: Computer['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />
      case 'offline':
        return <AlertCircle className="w-4 h-4" />
      case 'maintenance':
        return <Clock className="w-4 h-4" />
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'computers':
        return (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Computer Management</h2>
              <p className="text-slate-400">Monitor and manage all computer systems</p>
            </div>

            {/* Computer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {computers.map((computer) => (
                <div
                  key={computer.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{computer.id}</h3>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(computer.status)}`}>
                      {getStatusIcon(computer.status)}
                      <span className="text-sm font-medium capitalize">{computer.status}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Time Remaining</span>
                      <span className="text-white font-medium">{computer.timeRemaining}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-800">
                      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      case 'finance':
        return <FinanceDashboard />
      case 'users':
        return (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Управление клиентами</h2>
            <p className="text-slate-400">Управляйте клиентами и пользовательскими аккаунтами</p>
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400">Функции управления клиентами скоро будут доступны...</p>
            </div>
          </div>
        )
      case 'shift':
        return (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Управление сменами</h2>
            <p className="text-slate-400">Управляйте рабочими сменами и админами</p>
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
              <ShiftManager 
                isShiftOpen={isShiftOpen}
                activeAdmin={activeAdmin}
                onOpenShift={handleOpenShift}
                onCloseShift={handleCloseShift}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-slate-950">
      {showRoleLogin ? (
        <RoleLogin onLogin={handleRoleLogin} />
      ) : isClientView ? (
        clientUsername ? (
          <>
            {console.log('✅ Rendering ClientDashboard for user:', clientUsername)}
            <ClientDashboard username={clientUsername} onLogout={handleLogout} />
          </>
        ) : (
          <RoleLogin onLogin={handleRoleLogin} />
        )
      ) : activeTab === 'landing' ? (
        <LandingPage />
      ) : (
        <>
          <AdminNotification />
          {/* Sidebar */}
          <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h1 className={`text-2xl font-bold text-white ${hasUnreadNotifications ? 'animate-pulse' : ''}`}>AUEZ</h1>
                {currentUser && (
                  <div className="text-xs text-slate-400">
                    {currentUser.role === 'admin' ? 'Admin' : 'Client'}
                  </div>
                )}
              </div>
              <nav className="space-y-2 mb-6">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={toggleView}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Сменить роль</span>
                </button>
                <button
                  onClick={() => setIsDemoMode(!isDemoMode)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isDemoMode 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{isDemoMode ? 'Demo Mode ON' : 'Demo Mode'}</span>
                </button>
              </nav>
              
              {/* Live Log Component */}
              <div className="flex-1 overflow-hidden">
                <LiveLog />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                  <QuickSearch />
                </div>
                <div className="flex items-center space-x-4">
                  <Notifications 
                    notifications={notifications}
                    setNotifications={setNotifications}
                  />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'computers' ? (
                <PCMap />
              ) : activeTab === 'finance' ? (
                <FinanceDashboard />
              ) : activeTab === 'shift' ? (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Управление сменами</h2>
                    <p className="text-slate-400">Управляйте рабочими сменами и админами</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <ShiftManager 
                      isShiftOpen={isShiftOpen}
                      activeAdmin={activeAdmin}
                      onOpenShift={handleOpenShift}
                      onCloseShift={handleCloseShift}
                    />
                  </div>
                </div>
              ) : activeTab === 'settings' ? (
                <Settings 
                  clubName={clubName}
                  logoUrl={logoUrl}
                  onClubNameChange={handleClubNameChange}
                  onLogoChange={handleLogoChange}
                />
              ) : (
                <div className="p-8">
                  {renderContent()}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
    </ErrorBoundary>
  )
}

export default App
