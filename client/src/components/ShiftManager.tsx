import { User, LogIn, LogOut } from 'lucide-react'

interface ShiftManagerProps {
  isShiftOpen: boolean
  activeAdmin: string
  onOpenShift: () => void
  onCloseShift: () => void
}

export default function ShiftManager({ isShiftOpen, activeAdmin, onOpenShift, onCloseShift }: ShiftManagerProps) {
  return (
    <div className="p-4 border-t border-slate-800">
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-slate-400">
          <User className="w-4 h-4" />
          <span className="text-sm">Админ: {activeAdmin}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            isShiftOpen ? 'text-green-400' : 'text-red-400'
          }`}>
            Смена: {isShiftOpen ? 'Открыта' : 'Закрыта'}
          </span>
          
          <button
            onClick={isShiftOpen ? onCloseShift : onOpenShift}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
              isShiftOpen
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isShiftOpen ? (
              <>
                <LogOut className="w-3 h-3" />
                <span>Закрыть смену</span>
              </>
            ) : (
              <>
                <LogIn className="w-3 h-3" />
                <span>Открыть смену</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
