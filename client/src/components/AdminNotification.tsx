import { useState, useEffect } from 'react'
import { Bell, X, Monitor } from 'lucide-react'

interface Notification {
  type: 'session_start' | 'session_end' | 'admin_call'
  message: string
  timestamp: string
  userId?: number
  userPhone?: string
  cost?: number
  sessionId?: number
}

export default function AdminNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isVisible] = useState(true)

  // Play ping sound
  const playPingSound = () => {
    try {
      const audio = new Audio('/ping.mp3')
      audio.volume = 0.5
      audio.play().catch(err => console.log('Audio play failed:', err))
    } catch (error) {
      console.log('Audio not available:', error)
    }
  }

  // Listen for admin notifications from server console
  useEffect(() => {
    const checkNotifications = setInterval(() => {
      // In a real app, this would be WebSocket or Server-Sent Events
      // For now, we'll simulate by checking recent session starts
      fetch('/api/session/active?userId=1')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.session) {
            const newNotification: Notification = {
              type: 'session_start',
              message: `PC-001: Session Started by 777`,
              timestamp: new Date().toISOString(),
              userId: 1,
              userPhone: '777',
              cost: 500,
              sessionId: data.session.id
            }
            
            // Check if this is a new notification
            const exists = notifications.some(n => 
              n.sessionId === newNotification.sessionId
            )
            
            if (!exists && isVisible) {
              setNotifications(prev => [newNotification, ...prev].slice(0, 5))
              playPingSound()
              
              // Auto-hide after 5 seconds
              setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.sessionId !== newNotification.sessionId))
              }, 5000)
            }
          }
        })
        .catch(err => console.log('Notification check failed:', err))
    }, 3000) // Check every 3 seconds

    return () => clearInterval(checkNotifications)
  }, [notifications, isVisible])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'session_start':
        return <Monitor className="w-5 h-5 text-green-400" />
      case 'session_end':
        return <Monitor className="w-5 h-5 text-red-400" />
      case 'admin_call':
        return <Bell className="w-5 h-5 text-yellow-400" />
      default:
        return <Bell className="w-5 h-5 text-slate-400" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'session_start':
        return 'bg-green-500/10 border-green-500/30'
      case 'session_end':
        return 'bg-red-500/10 border-red-500/30'
      case 'admin_call':
        return 'bg-yellow-500/10 border-yellow-500/30'
      default:
        return 'bg-slate-500/10 border-slate-500/30'
    }
  }

  if (!isVisible || notifications.length === 0) return null

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.sessionId || notification.timestamp}
          className={`bg-slate-900/95 backdrop-blur-sm border rounded-lg p-4 shadow-xl animate-pulse ${getNotificationColor(notification.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{notification.message}</p>
                {notification.cost && (
                  <p className="text-green-400 text-xs mt-1">Cost: {notification.cost} ₸</p>
                )}
                <p className="text-slate-400 text-xs mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.sessionId !== notification.sessionId))}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
