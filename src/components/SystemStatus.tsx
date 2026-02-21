import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react'

interface HealthData {
  timestamp: string
  status: 'healthy' | 'degraded' | 'error'
  services: {
    database: any
    memory: any
    permissions: any
    system: any
  }
  error?: string
}

export default function SystemStatus() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check health every 10 seconds
    const healthInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setHealth(data)
      } catch (error) {
        setHealth({
          timestamp: new Date().toISOString(),
          status: 'error',
          services: {
            database: { status: 'error' },
            memory: { status: 'error' },
            permissions: { status: 'error' },
            system: { status: 'error' }
          },
          error: 'Health check failed'
        })
      }
    }, 10000)

    return () => clearInterval(healthInterval)
  }, [])

  // Toggle visibility with Ctrl+Shift+H
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        setIsVisible(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!isVisible) return null

  const getStatusColor = () => {
    if (!health) return 'bg-gray-500'
    switch (health.status) {
      case 'healthy': return 'bg-green-500'
      case 'degraded': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = () => {
    if (!health) return <AlertTriangle className="w-4 h-4" />
    switch (health.status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />
      case 'degraded': return <Activity className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-slate-700/50 min-w-80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-white font-medium text-sm">System Status</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
      
      {health && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Overall:</span>
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <span className={`font-medium ${
              health.status === 'healthy' ? 'text-green-400' :
              health.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {health.status.toUpperCase()}
            </span>
          </div>
          
          <div className="border-t border-slate-700/50 pt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database:</span>
              <span className={`font-medium ${
                health.services.database?.connected ? 'text-green-400' : 'text-red-400'
              }`}>
                {health.services.database?.connected ? 'CONNECTED' : 'ERROR'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Memory:</span>
              <span className="text-slate-300">
                {health.services.memory?.heapUsed || 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Port:</span>
              <span className="text-slate-300">
                {health.services.system?.port || 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Uptime:</span>
              <span className="text-slate-300">
                {health.services.system?.uptime || 'N/A'}
              </span>
            </div>
            
            {health.error && (
              <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                <span className="text-red-400">{health.error}</span>
              </div>
            )}
          </div>
          
          <div className="text-slate-500 text-xs mt-2 pt-2 border-t border-slate-700/50">
            Last check: {health.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
          </div>
        </div>
      )}
    </div>
  )
}
