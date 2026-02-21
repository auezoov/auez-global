import { Clock } from 'lucide-react'

interface TariffCardProps {
  title: string
  price: number
  duration: string
  popular?: boolean
}

export default function TariffCard({ title, price, duration, popular = false }: TariffCardProps) {
  return (
    <div className={`bg-slate-900 border rounded-xl p-6 transition-all hover:scale-105 ${
      popular ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-slate-800'
    }`}>
      {popular && (
        <div className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full inline-block mb-4">
          Популярный
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <Clock className="w-8 h-8 text-cyan-400" />
        <span className="text-2xl font-bold text-white">{price.toLocaleString()} ₸</span>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{duration}</p>
      
      <button className={`w-full mt-6 py-2 px-4 rounded-lg transition-colors ${
        popular 
          ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
          : 'bg-slate-800 hover:bg-slate-700 text-white'
      }`}>
        Выбрать тариф
      </button>
    </div>
  )
}
