import { useState } from 'react'
import { Monitor, Clock, CheckCircle, Crown } from 'lucide-react'
import ZoneToggle from './ZoneToggle'

interface PC {
  id: string
  x: number
  y: number
  status: 'available' | 'busy' | 'maintenance' | 'reserved'
  customer?: string
  timeRemaining?: string
  zone?: 'general' | 'vip'
}

const statusLabels = {
  available: 'Свободен',
  busy: 'Занят',
  maintenance: 'Обслуживание',
  reserved: 'Забронировано'
}

const initialPCs: PC[] = [
  { id: 'PC-001', x: 0, y: 0, status: 'available', zone: 'general' },
  { id: 'PC-002', x: 1, y: 0, status: 'busy', customer: 'Иван Петров', timeRemaining: '1ч 30м', zone: 'general' },
  { id: 'PC-003', x: 2, y: 0, status: 'available', zone: 'general' },
  { id: 'PC-004', x: 3, y: 0, status: 'maintenance', zone: 'general' },
  { id: 'PC-005', x: 0, y: 1, status: 'busy', customer: 'Мария Иванова', timeRemaining: '45м', zone: 'general' },
  { id: 'PC-006', x: 1, y: 1, status: 'available', zone: 'general' },
  { id: 'PC-007', x: 2, y: 1, status: 'available', zone: 'general' },
  { id: 'PC-008', x: 3, y: 1, status: 'busy', customer: 'Алексей Смирнов', timeRemaining: '2ч 15м', zone: 'general' },
  { id: 'PC-009', x: 0, y: 2, status: 'available', zone: 'general' },
  { id: 'PC-010', x: 1, y: 2, status: 'available', zone: 'general' },
  { id: 'PC-011', x: 2, y: 2, status: 'maintenance', zone: 'general' },
  { id: 'PC-012', x: 3, y: 2, status: 'available', zone: 'general' },
  { id: 'VIP-001', x: 0, y: 3, status: 'available', zone: 'vip' },
  { id: 'VIP-002', x: 1, y: 3, status: 'busy', customer: 'Тимур Асанов', timeRemaining: '3ч 00м', zone: 'vip' },
  { id: 'VIP-003', x: 2, y: 3, status: 'available', zone: 'vip' },
  { id: 'VIP-004', x: 3, y: 3, status: 'available', zone: 'vip' },
]

export default function PCMap() {
  const [pcs, setPCs] = useState<PC[]>(initialPCs)
  const [draggedPC, setDraggedPC] = useState<string | null>(null)
  const [selectedPC, setSelectedPC] = useState<PC | null>(null)
  const [activeZone, setActiveZone] = useState<'general' | 'vip'>('general')

  const getStatusColor = (status: PC['status'], zone?: PC['zone']) => {
    const baseColor = status === 'available' ? 'bg-green-500 hover:bg-green-600 border-green-600' :
                      status === 'busy' ? 'bg-red-500 hover:bg-red-600 border-red-600' :
                      status === 'maintenance' ? 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600' :
                      'bg-blue-500 hover:bg-blue-600 border-blue-600'
    
    return zone === 'vip' ? `${baseColor} shadow-lg shadow-yellow-500/50` : baseColor
  }

  const getStatusIcon = (status: PC['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-white" />
      case 'busy':
        return <Monitor className="w-4 h-4 text-white" />
      case 'maintenance':
        return <Clock className="w-4 h-4 text-white" />
      case 'reserved':
        return <Clock className="w-4 h-4 text-white" />
    }
  }

  const handleDragStart = (pcId: string) => {
    setDraggedPC(pcId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetX: number, targetY: number) => {
    e.preventDefault()
    if (draggedPC) {
      setPCs(prev => prev.map(pc => 
        pc.id === draggedPC ? { ...pc, x: targetX, y: targetY } : pc
      ))
      setDraggedPC(null)
    }
  }

  const handlePCClick = (pc: PC) => {
    setSelectedPC(pc)
  }

  const changePCStatus = (pcId: string, newStatus: PC['status']) => {
    setPCs(prev => prev.map(pc => 
      pc.id === pcId ? { 
        ...pc, 
        status: newStatus,
        customer: newStatus === 'busy' ? 'Новый клиент' : newStatus === 'reserved' ? 'Забронировано' : undefined,
        timeRemaining: newStatus === 'busy' ? '2ч 00м' : newStatus === 'reserved' ? 'Забронировано' : undefined
      } : pc
    ))
  }

  const bookPC = (pcId: string) => {
    changePCStatus(pcId, 'reserved')
  }

  return (
    <div className="p-6">
      <ZoneToggle activeZone={activeZone} onZoneChange={setActiveZone} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {activeZone === 'vip' ? 'VIP комната' : 'Компьютерный зал'}
          </h2>
          <p className="text-slate-400">
            {activeZone === 'vip' 
              ? 'Перетаскивайте VIP компьютеры для изменения планировки' 
              : 'Перетаскивайте компьютеры для изменения планировки зала'
            }
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-slate-300">Свободен</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-slate-300">Занят</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-slate-300">Забронировано</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-slate-300">Обслуживание</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PC Map Grid */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: activeZone === 'vip' ? 4 : 12 }, (_, index) => {
                const x = index % 4
                const y = Math.floor(index / 4)
                const pc = pcs.find(p => p.x === x && p.y === y && p.zone === activeZone)
                
                return (
                  <div
                    key={index}
                    className="aspect-square border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, x, y)}
                  >
                    {pc ? (
                      <div
                        draggable
                        onDragStart={() => handleDragStart(pc.id)}
                        onClick={() => handlePCClick(pc)}
                        className={`w-full h-full ${getStatusColor(pc.status, pc.zone)} border-2 rounded-lg flex flex-col items-center justify-center cursor-move transition-all transform hover:scale-105 ${
                        pc.status === 'busy' ? 'animate-pulse shadow-lg shadow-green-500/50' : ''
                      } ${pc.zone === 'vip' ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''}`}
                      >
                        {getStatusIcon(pc.status)}
                        <span className="text-xs text-white font-medium mt-1">{pc.id}</span>
                        {pc.zone === 'vip' && <Crown className="w-3 h-3 text-yellow-400 mt-1" />}
                      </div>
                    ) : (
                      <div className="text-slate-600 text-sm">Empty</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* PC Details Panel */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Детали компьютера</h3>
            
            {selectedPC ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">ID компьютера</label>
                  <p className="text-white font-medium">{selectedPC.id}</p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Статус</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(selectedPC.status)}
                    <span className="text-white">{statusLabels[selectedPC.status]}</span>
                  </div>
                </div>

                {selectedPC.customer && (
                  <div>
                    <label className="text-sm text-slate-400">Клиент</label>
                    <p className="text-white">{selectedPC.customer}</p>
                  </div>
                )}

                {selectedPC.timeRemaining && (
                  <div>
                    <label className="text-sm text-slate-400">Осталось времени</label>
                    <p className="text-white">{selectedPC.timeRemaining}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <label className="text-sm text-slate-400 block mb-2">Изменить статус</label>
                  <div className="space-y-2">
                    {selectedPC.status === 'available' && (
                      <button
                        onClick={() => bookPC(selectedPC.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Забронировать
                      </button>
                    )}
                    <button
                      onClick={() => changePCStatus(selectedPC.id, 'available')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Установить "Свободен"
                    </button>
                    <button
                      onClick={() => changePCStatus(selectedPC.id, 'busy')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Установить "Занят"
                    </button>
                    <button
                      onClick={() => changePCStatus(selectedPC.id, 'maintenance')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Установить "Обслуживание"
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Нажмите на компьютер для просмотра деталей</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
