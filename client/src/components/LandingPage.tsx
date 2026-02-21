import { useState } from 'react'
import { ArrowRight, Monitor, TrendingUp, Users, Star, Gamepad2, Zap, Shield, Crown } from 'lucide-react'

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-full filter blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-sm border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-3 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2">
                  <Gamepad2 className="w-6 h-6 text-purple-400" />
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    AUEZ
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button className="text-slate-300 hover:text-white transition-colors">Возможности</button>
                <button className="text-slate-300 hover:text-white transition-colors">Тарифы</button>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                  Начать бесплатно
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-4xl">
            {/* Main Heading */}
            <div className="mb-12">
              <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  AUEZ
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-slate-300 font-light leading-relaxed">
                Будущее вашего{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  компьютерного клуба
                </span>
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div 
                className="group bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/60 transition-all transform hover:scale-105"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="flex items-center justify-between mb-4">
                  <Monitor className="w-8 h-8 text-purple-400" />
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 transition-all ${
                          i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                        } ${isHovered ? 'animate-pulse' : ''}`} 
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">200+</h3>
                <p className="text-slate-400">Компьютеров</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/60 transition-all transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-cyan-400" />
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">15,000+</h3>
                <p className="text-slate-400">Активных игроков</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/60 transition-all transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <Crown className="w-8 h-8 text-yellow-400" />
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">99.9%</h3>
                <p className="text-slate-400">Время работы</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="text-left">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Мгновенный старт</h3>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Никаких очередей и ожидания. Начните игру за 10 секунд.
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white">Безопасность</h3>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Современное оборудование и защита данных. Играйте с уверенностью.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">
                Готовы поднять ваш клуб на новый уровень?
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Присоединяйтесь к сотням успешных клубов по всему Казахстану
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25">
                  <span>Начать бесплатно</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-xl transition-all border border-slate-700 hover:border-slate-600">
                  Узнать больше
                </button>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">4,500,000 ₸</div>
                <p className="text-slate-400">Средний месячный доход</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
                <p className="text-slate-400">Поддержка</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
                <p className="text-slate-400">Игр в библиотеке</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">3 сек</div>
                <p className="text-slate-400">Время загрузки</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
