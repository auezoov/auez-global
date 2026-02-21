import { useState, useEffect } from 'react'
import { Activity, CheckCircle, AlertCircle, Users, Clock } from 'lucide-react'

interface LogEntry {
  id: string
  type: 'session_end' | 'balance_add' | 'shift_start' | 'pc_status' | 'admin_call' | 'session_start'
  message: string
  timestamp: string
  color: string
  icon?: React.ReactNode
}

export default function LiveLog() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      type: 'session_end',
      message: 'ПК-008: Сессия завершена',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      color: 'text-red-400',
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      id: '2',
      type: 'balance_add',
      message: 'Клиент Иван: Пополнил баланс на 2000 ₸',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      color: 'text-green-400',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: '3',
      type: 'shift_start',
      message: 'Смена открыта: Админ Ерлан',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      color: 'text-blue-400',
      icon: <Users className="w-4 h-4" />
    }
  ])

  const addLog = (type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      color: type === 'session_start' ? 'text-green-400' :
              type === 'session_end' ? 'text-red-400' : 
              type === 'balance_add' ? 'text-green-400' : 
              type === 'shift_start' ? 'text-blue-400' : 
              type === 'pc_status' ? 'text-yellow-400' : 
              type === 'admin_call' ? 'text-purple-400' : 'text-slate-400',
      icon: type === 'session_start' ? <CheckCircle className="w-4 h-4" /> :
              type === 'session_end' ? <AlertCircle className="w-4 h-4" /> : 
              type === 'balance_add' ? <CheckCircle className="w-4 h-4" /> : 
              type === 'shift_start' ? <Users className="w-4 h-4" /> : 
              type === 'pc_status' ? <Activity className="w-4 h-4" /> : 
              type === 'admin_call' ? <Users className="w-4 h-4" /> : <Clock className="w-4 h-4" />
    }

    setLogs(prev => [newLog, ...prev].slice(0, 8)) // Keep only 8 most recent logs for sidebar
  }

  // Listen for session starts from server
  useEffect(() => {
    const checkSessionStarts = setInterval(() => {
      fetch('/api/session/active?userId=1')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.session) {
            // Check if this is a recent session (within last 10 seconds)
            const sessionAge = Date.now() - new Date(data.session.startTime).getTime()
            if (sessionAge < 10000) {
              addLog('session_start', 'PC-001: Session Started by 777')
            }
          }
        })
        .catch(err => console.log('Session check failed:', err))
    }, 5000) // Check every 5 seconds

    return () => clearInterval(checkSessionStarts)
  }, [])

  // Simulate real-time logs with more frequent updates for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvents = [
        { type: 'pc_status' as const, message: 'ПК-003: Статус изменен на "Занят"' },
        { type: 'balance_add' as const, message: 'Клиент Мария: Пополнила баланс на 800 ₸' },
        { type: 'session_end' as const, message: 'ПК-001: Сессия завершена' },
        { type: 'admin_call' as const, message: 'Вызов администратора от ПК-005' },
        { type: 'pc_status' as const, message: 'VIP-002: Статус изменен на "Свободен"' },
        { type: 'balance_add' as const, message: 'Клиент Алексей: Пополнил баланс на 4500 ₸' },
      ]
      
      const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)]
      addLog(randomEvent.type, randomEvent.message)
    }, 15000) // Add new log every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}ч`
    if (minutes > 0) return `${minutes}м`
    return 'только что'
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span>Журнал событий</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start space-x-2 p-2 bg-slate-900/50 rounded border border-slate-700/30 hover:bg-slate-900/70 transition-colors"
          >
            <div className={log.color + ' mt-0.5'}>
              {log.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 mb-1">{formatTime(log.timestamp)}</div>
              <p className="text-xs text-white break-words leading-tight">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
      {logs.length === 0 && (
        <div className="text-center py-3">
          <Activity className="w-5 h-5 text-slate-600 mx-auto mb-1" />
          <p className="text-xs text-slate-500">Нет событий</p>
        </div>
      )}
    </div>
  )
}
