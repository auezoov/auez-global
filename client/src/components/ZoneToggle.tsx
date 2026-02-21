import { Crown } from 'lucide-react'

interface ZoneToggleProps {
  activeZone: 'general' | 'vip'
  onZoneChange: (zone: 'general' | 'vip') => void
}

export default function ZoneToggle({ activeZone, onZoneChange }: ZoneToggleProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => onZoneChange('general')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeZone === 'general'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Общий зал
        </button>
        <button
          onClick={() => onZoneChange('vip')}
          className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
            activeZone === 'vip'
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>VIP комната</span>
        </button>
      </div>
    </div>
  )
}
