import { useState } from 'react'
import { Save, X, Image as ImageIcon, Type } from 'lucide-react'

interface SettingsProps {
  clubName: string
  logoUrl: string
  onClubNameChange: (name: string) => void
  onLogoChange: (logoUrl: string) => void
}

export default function Settings({ clubName, logoUrl, onClubNameChange, onLogoChange }: SettingsProps) {
  const [tempClubName, setTempClubName] = useState(clubName)
  const [tempLogoUrl, setTempLogoUrl] = useState(logoUrl)
  const [isSaving, setIsSaving] = useState(false)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setTempLogoUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      onClubNameChange(tempClubName)
      onLogoChange(tempLogoUrl)
      setIsSaving(false)
    }, 1000)
  }

  const handleReset = () => {
    setTempClubName('AUEZ')
    setTempLogoUrl('')
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Настройки клуба</h2>
        <p className="text-slate-400">Персонализируйте ваш компьютерный клуб</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Club Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Основные настройки</h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">
                Название клуба
              </label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={tempClubName}
                  onChange={(e) => setTempClubName(e.target.value)}
                  placeholder="Введите название клуба"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">
                Часовой пояс
              </label>
              <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all">
                <option>UTC+5 (Алматы)</option>
                <option>UTC+6 (Астана)</option>
                <option>UTC+5 (Шымкент)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">
                Валюта по умолчанию
              </label>
              <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all">
                <option>KZT - Казахстанский тенге (₸)</option>
                <option>RUB - Российский рубль (₽)</option>
                <option>USD - Доллар США ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Логотип клуба</h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">
                Загрузить логотип
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center w-full py-8 bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:bg-slate-700 hover:border-cyan-500 transition-all"
                >
                  {tempLogoUrl ? (
                    <div className="text-center">
                      <img 
                        src={tempLogoUrl} 
                        alt="Club logo" 
                        className="w-24 h-24 mx-auto mb-4 rounded-lg object-cover"
                      />
                      <p className="text-sm text-slate-400">Нажмите для замены логотипа</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <p className="text-sm text-slate-400">Нажмите для загрузки логотипа</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {tempLogoUrl && (
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                    <img 
                      src={tempLogoUrl} 
                      alt="Club logo preview" 
                      className="w-6 h-6 rounded object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Логотип загружен</p>
                    <p className="text-slate-400 text-xs">Размер: 256x256px</p>
                  </div>
                </div>
                <button
                  onClick={() => setTempLogoUrl('')}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Сбросить настройки</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить черновик</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Применить настройки</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
