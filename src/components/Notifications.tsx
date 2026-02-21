import { useState } from 'react'
import { Bell, X, Clock, UserPlus, AlertCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'warning' | 'success' | 'info'
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationsProps {
  notifications?: Notification[]
  setNotifications?: React.Dispatch<React.SetStateAction<Notification[]>>
}

export default function Notifications({ notifications: externalNotifications, setNotifications: externalSetNotifications }: NotificationsProps = {}) {
  const [internalNotifications, setInternalNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Время истекает',
      message: 'У ПК-005 заканчивается время (5 мин)',
      time: '2 мин назад',
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Новый клиент',
      message: 'Новый клиент зарегистрирован: Данияр К.',
      time: '10 мин назад',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Система',
      message: 'VIP комната готова к приему клиентов',
      time: '15 мин назад',
      read: true
    }
  ])

  // Use external state if provided, otherwise use internal state
  const notifications = externalNotifications || internalNotifications
  const setNotifications = externalSetNotifications || setInternalNotifications

  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'success':
        return <UserPlus className="w-4 h-4 text-green-400" />
      case 'info':
        return <AlertCircle className="w-4 h-4 text-blue-400" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5'
      case 'success':
        return 'border-green-500/20 bg-green-500/5'
      case 'info':
        return 'border-blue-500/20 bg-blue-500/5'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Уведомления</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Отметить все как прочитанные
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Нет новых уведомлений</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'border-l-4' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium">{notification.title}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-400">{notification.time}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                clearNotification(notification.id)
                              }}
                              className="text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
