import { useState } from 'react'
import { Clock, DollarSign, Plus, ArrowRight } from 'lucide-react'

interface TimesUpScreenProps {
  username: string
  balance: number
  onAddTime: (amount: number, cost: number) => void
  onLogout: () => void
}

export default function TimesUpScreen({ username, balance, onAddTime, onLogout }: TimesUpScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const timePackages = [
    { amount: 3600, cost: 800, label: '1 час', description: 'Для быстрых задач' },
    { amount: 10800, cost: 2000, label: '3 часа', description: 'Оптимальный пакет' },
    { amount: 32400, cost: 4500, label: '9 часов', description: 'Для долгой игры' },
  ]

  const handleAddTime = async (amount: number, cost: number) => {
    if (balance < cost) {
      alert('Недостаточно средств на балансе!')
      return
    }

    setIsProcessing(true)
    try {
      await onAddTime(amount, cost)
    } catch (error) {
      console.error('Failed to add time:', error)
      alert('Не удалось добавить время. Попробуйте еще раз.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-900/90 to-orange-900/90 border border-red-500/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl shadow-red-500/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <Clock className="w-8 h-8 text-red-400" />
            <span className="text-2xl font-bold text-white">Время истекло!</span>
          </div>
          <p className="text-slate-300 text-lg">Ваше время на компьютере закончилось</p>
          <p className="text-red-400 font-medium text-xl mt-2">{username}</p>
        </div>

        {/* Balance Display */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="text-white text-lg font-medium">Текущий баланс</span>
            </div>
            <span className="text-2xl font-bold text-green-400">{balance.toLocaleString()} ₸</span>
          </div>
        </div>

        {/* Time Packages */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Добавить время</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timePackages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-slate-800/50 border rounded-xl p-4 transition-all transform hover:scale-105 ${
                  balance >= pkg.cost 
                    ? 'border-green-500/30 hover:border-green-500/50 cursor-pointer' 
                    : 'border-slate-700 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => balance >= pkg.cost && handleAddTime(pkg.amount, pkg.cost)}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">{pkg.label}</div>
                  <div className="text-slate-400 text-sm mb-3">{pkg.description}</div>
                  <div className="text-xl font-bold text-green-400">{pkg.cost.toLocaleString()} ₸</div>
                  {balance < pkg.cost && (
                    <div className="text-red-400 text-xs mt-2">Недостаточно средств</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = 'tel:+77000000000'} // Admin phone
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Позвонить администратору</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all border border-slate-700 hover:border-slate-600"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Завершить сеанс</span>
          </button>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Обработка...</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Добавьте время или завершите сеанс для продолжения
          </p>
        </div>
      </div>
    </div>
  )
}
