import { useState, useEffect } from 'react'
import { Computer, Clock, DollarSign, Users } from 'lucide-react'
import api from '../services/api'

interface ComputerData {
  id: string
  status: string
  price: number
  lastUpdate: string
}

export default function ComputerList() {
  const [computers, setComputers] = useState<ComputerData[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState<{ [key: string]: boolean }>({})
  const [userId, setUserId] = useState('user-001')

  useEffect(() => {
    loadComputers()
  }, [])

  const loadComputers = async () => {
    try {
      setLoading(true)
      const data = await api.getComputers()
      setComputers(data)
    } catch (error) {
      console.error('Failed to load computers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookComputer = async (computerId: string) => {
    try {
      setBooking(prev => ({ ...prev, [computerId]: true }))
      
      const result = await api.bookComputer(computerId, userId, 60) // 1 hour booking
      
      if (result.success) {
        // Update computer status in local state
        setComputers(prev => 
          prev.map(comp => 
            comp.id === computerId 
              ? { ...comp, status: 'занят' }
              : comp
          )
        )
        alert(`Компьютер ${computerId} забронирован! Стоимость: ${result.booking.totalCost} тг`)
      } else {
        alert('Ошибка бронирования')
      }
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Ошибка бронирования')
    } finally {
      setBooking(prev => ({ ...prev, [computerId]: false }))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'свободен': return 'bg-green-500'
      case 'занят': return 'bg-red-500'
      case 'забронирован': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'свободен': return 'Свободен'
      case 'занят': return 'Занят'
      case 'забронирован': return 'Забронирован'
      default: return 'Неизвестно'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Компьютеры</h1>
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Computer className="w-8 h-8" />
            Компьютеры
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="ID пользователя"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="px-4 py-2 bg-gray-800 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {computers.map((computer) => (
            <div
              key={computer.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{computer.id}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(computer.status)}`} />
                    <span className="text-sm">{getStatusText(computer.status)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{computer.price}</div>
                  <div className="text-xs text-gray-400">тг/час</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  Обновлен: {new Date(computer.lastUpdate).toLocaleTimeString()}
                </div>
                
                {computer.status === 'свободен' && (
                  <button
                    onClick={() => handleBookComputer(computer.id)}
                    disabled={booking[computer.id]}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {booking[computer.id] ? 'Бронирование...' : 'Забронировать'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-green-400">Свободно</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {computers.filter(c => c.status === 'свободен').length}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-red-400">Занято</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {computers.filter(c => c.status === 'занят').length}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-yellow-400">Забронировано</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {computers.filter(c => c.status === 'забронирован').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
