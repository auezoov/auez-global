import { useState } from 'react'
import { Search, Monitor, User } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'pc' | 'customer'
  name: string
  status?: string
  zone?: string
}

export default function QuickSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const allData: SearchResult[] = [
    { id: 'PC-001', type: 'pc', name: 'PC-001', status: 'Свободен', zone: 'Общий зал' },
    { id: 'PC-002', type: 'pc', name: 'PC-002', status: 'Занят', zone: 'Общий зал' },
    { id: 'PC-008', type: 'pc', name: 'PC-008', status: 'Занят', zone: 'Общий зал' },
    { id: 'VIP-001', type: 'pc', name: 'VIP-001', status: 'Свободен', zone: 'VIP комната' },
    { id: 'VIP-002', type: 'pc', name: 'VIP-002', status: 'Занят', zone: 'VIP комната' },
    { id: '1', type: 'customer', name: 'Иван Петров' },
    { id: '2', type: 'customer', name: 'Мария Иванова' },
    { id: '3', type: 'customer', name: 'Алексей Смирнов' },
    { id: '4', type: 'customer', name: 'Тимур Асанов' },
    { id: '5', type: 'customer', name: 'Данияр К.' },
  ]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const filtered = allData.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase())
    )
    setResults(filtered)
    setIsOpen(true)
  }

  const getResultIcon = (type: SearchResult['type']) => {
    return type === 'pc' ? <Monitor className="w-4 h-4" /> : <User className="w-4 h-4" />
  }

  const getResultColor = (type: SearchResult['type']) => {
    return type === 'pc' ? 'text-blue-400' : 'text-green-400'
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Быстрый поиск ПК или клиентов..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  console.log(`Selected: ${result.name}`)
                  setIsOpen(false)
                  setSearchTerm('')
                }}
              >
                <div className={getResultColor(result.type)}>
                  {getResultIcon(result.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{result.name}</p>
                  {result.status && (
                    <p className="text-slate-400 text-xs">
                      {result.status} • {result.zone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {results.length === 0 && (
            <div className="p-4 text-center text-slate-400">
              <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ничего не найдено</p>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
