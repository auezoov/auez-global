import { BarChart3, Download, TrendingUp, Users, Monitor, UserPlus } from 'lucide-react'
import TariffCard from './TariffCard'
import { useState, useEffect } from 'react'
import api from '../services/api'

interface FinanceData {
  todayRevenue: number
  totalSessions: number
  popularPC: string
  newCustomers: number
}

export default function FinanceDashboard() {
  const [activeZone, setActiveZone] = useState<'general' | 'vip'>('general')
  const [financeData, setFinanceData] = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const isDemoMode = false // This would be passed as prop in real app
  
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const data = await api.getFinanceData()
        setFinanceData(data)
      } catch (err) {
        console.error('Error fetching finance data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchFinanceData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchFinanceData, 30000)
    return () => clearInterval(interval)
  }, [])

  const weeklyData = [
    { day: 'Пн', revenue: 125000 },
    { day: 'Вт', revenue: 145000 },
    { day: 'Ср', revenue: 132000 },
    { day: 'Чт', revenue: 168000 },
    { day: 'Пт', revenue: 205000 },
    { day: 'Сб', revenue: 225000 },
    { day: 'Вс', revenue: 190000 },
  ]

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue))

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Финансовая панель</h2>
          <div className="flex items-center space-x-3">
            <p className="text-slate-400">Отслеживайте доходы и финансовые показатели</p>
            {isDemoMode && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded-full">
                DEMO MODE
              </span>
            )}
            {loading && (
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full animate-pulse">
                Загрузка...
              </span>
            )}
            {error && (
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                Ошибка: {error}
              </span>
            )}
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Скачать отчет в PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Выручка за неделю</h3>
              <div className="flex items-center space-x-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>День недели</span>
                <span>Доход (₸)</span>
              </div>
              
              {weeklyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">{data.day}</span>
                    <span className="text-white font-medium">{data.revenue.toLocaleString()} ₸</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Итого за неделю:</span>
                <span className="text-2xl font-bold text-white">
                  {weeklyData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()} ₸
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Statistics */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Статистика за сегодня</h3>
            
            <div className="space-y-6">
              {/* Total Sessions */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Всего сессий</p>
                  <p className="text-white text-xl font-bold">{financeData?.totalSessions || 0}</p>
                </div>
              </div>

              {/* Most Popular PC */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Monitor className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Популярный ПК</p>
                  <p className="text-white text-xl font-bold">{financeData?.popularPC || 'PC-008'}</p>
                </div>
              </div>

              {/* New Customers */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <UserPlus className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Новые клиенты</p>
                  <p className="text-white text-xl font-bold">{financeData?.newCustomers || 0}</p>
                </div>
              </div>

              {/* Total Revenue Today */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Касса за сегодня:</span>
                  <span className="text-2xl font-bold text-green-400">
                    {financeData?.todayRevenue?.toLocaleString() || '0'} ₸
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+8%</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Активные клиенты</p>
          <p className="text-2xl font-bold text-white">156</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Monitor className="w-8 h-8 text-green-400" />
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">95%</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Загрузка зала</p>
          <p className="text-2xl font-bold text-white">11/12 ПК</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+15%</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Средний чек</p>
          <p className="text-2xl font-bold text-white">1,750 ₸</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Download className="w-8 h-8 text-yellow-400" />
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full">Сегодня</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Часов работы</p>
          <p className="text-2xl font-bold text-white">14.5</p>
        </div>
      </div>

      {/* Tariffs Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Тарифы</h3>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveZone('general')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeZone === 'general'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Общий зал
            </button>
            <button
              onClick={() => setActiveZone('vip')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeZone === 'vip'
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VIP комната
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TariffCard 
            title="1 Час" 
            price={activeZone === 'vip' ? 1500 : 800} 
            duration={activeZone === 'vip' ? 'VIP комфорт' : 'Идеально для быстрых задач'}
          />
          <TariffCard 
            title="3 Часа" 
            price={activeZone === 'vip' ? 4000 : 2000} 
            duration={activeZone === 'vip' ? 'VIP премиум' : 'Для комфортной работы'}
            popular={true}
          />
          <TariffCard 
            title="Ночной пакет" 
            price={activeZone === 'vip' ? 6000 : 4500} 
            duration={activeZone === 'vip' ? 'VIP ночь с 22:00 до 08:00' : 'С 22:00 до 08:00'}
          />
        </div>
      </div>
    </div>
  )
}
