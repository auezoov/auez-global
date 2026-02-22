import { useState, useEffect } from 'react'
import apiService from '../services/api'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

declare global {
  interface Window {
    Telegram?: {
      Login: {
        auth: (options: any, callback: (user: TelegramUser) => void) => void
      }
    }
    onTelegramAuth?: (user: TelegramUser) => void
  }
}

type Language = 'RU' | 'EN' | 'KZ'

const translations = {
  RU: {
    title: 'AUEZ',
    subtitle: 'Войти через Telegram',
    welcome: 'Добро пожаловать в AUEZ Club',
    description: 'Войдите через Telegram для продолжения',
    terms: 'Входя, вы соглашаетесь с нашими Условиями использования'
  },
  EN: {
    title: 'AUEZ',
    subtitle: 'Continue with Telegram',
    welcome: 'Welcome to AUEZ Club',
    description: 'Login with Telegram to continue',
    terms: 'By logging in, you agree to our Terms of Service'
  },
  KZ: {
    title: 'AUEZ',
    subtitle: 'Telegram арқылы кіру',
    welcome: 'AUEZ Club-ке қош келдіңіз',
    description: 'Жалғастыру үшін Telegram арқылы кіріңіз',
    terms: 'Кіру арқылы Сіз Қызмет көрсету шарттарымен келісесіз'
  }
}

const flagEmojis = {
  RU: '🇷🇺',
  EN: '🇬🇧',
  KZ: '🇰🇿'
}

export default function TelegramLogin() {
  const [language, setLanguage] = useState<Language>('RU')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language
    if (savedLanguage && ['RU', 'EN', 'KZ'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('selectedLanguage', lang)
  }

  useEffect(() => {
    // Set up the callback function
    window.onTelegramAuth = async (user: TelegramUser) => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await apiService.telegramAuth(user)
        
        if (response.token) {
          apiService.setToken(response.token)
          window.location.href = '/dashboard'
        } else {
          setError('Authentication failed')
        }
      } catch (err) {
        setError('Authentication error')
        console.error('Telegram auth error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Load Telegram Login Widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'Auez_club_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-auth-url', 'https://auez-global.onrender.com/api/auth/telegram')
    script.setAttribute('data-request-access', 'write')
    script.async = true
    
    // Append to the widget container
    const widgetContainer = document.getElementById('telegram-login-widget')
    if (widgetContainer) {
      widgetContainer.appendChild(script)
    }

    return () => {
      // Cleanup
      delete window.onTelegramAuth
      if (widgetContainer && widgetContainer.contains(script)) {
        widgetContainer.removeChild(script)
      }
    }
  }, [])

  const t = translations[language]

  const handleTelegramLogin = () => {
    // Try to click the hidden Telegram button (most reliable method)
    const telegramButton = document.querySelector('#telegram-login-widget button') as HTMLButtonElement
    if (telegramButton) {
      telegramButton.click()
    } else {
      // Fallback: try JS API if available
      if (window.Telegram && window.Telegram.Login && window.Telegram.Login.auth) {
        window.Telegram.Login.auth(
          { bot_id: '8404137291', request_access: 'write' },
          (user: TelegramUser) => {
            if (window.onTelegramAuth) {
              window.onTelegramAuth(user)
            }
          }
        )
      } else {
        setError('Telegram widget not loaded. Please refresh the page.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-6 right-6 flex gap-2">
        {(['RU', 'EN', 'KZ'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
              language === lang 
                ? 'bg-cyan-500/20 border border-cyan-400/50 shadow-lg shadow-cyan-500/20' 
                : 'bg-white/10 border border-white/20 hover:bg-white/20'
            }`}
            title={lang}
          >
            {flagEmojis[lang]}
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Cyan Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mb-6 shadow-lg shadow-cyan-500/25">
              <span className="text-white font-bold text-xl tracking-wider">AUEZ</span>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">{t.welcome}</h1>
            <p className="text-gray-300 text-sm">{t.description}</p>
          </div>

          {/* Custom Login Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleTelegramLogin}
              disabled={isLoading}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56c-.21 2.25-1.12 7.68-1.58 10.18-.2 1.07-.58 1.43-.96 1.46-.82.07-1.44-.54-2.23-1.06-1.23-.81-1.93-1.31-3.12-2.1-1.38-.9-.49-1.39.3-2.2.21-.21 3.77-3.46 3.83-3.75.01-.04.01-.19-.07-.27s-.2-.06-.29-.03c-.12.04-2.09 1.33-5.91 3.9-.56.38-1.06.57-1.52.56-.5-.01-1.46-.28-2.18-.51-.88-.28-1.57-.43-1.51-.91.03-.25.38-.51 1.05-.78 4.11-1.79 6.85-2.97 8.22-3.55 3.92-1.63 4.73-1.91 5.26-1.92.12 0 .37.03.53.17.14.12.18.28.2.44.01.08.01.16 0 .24z"/>
                </svg>
                {isLoading ? 'Аутентификация...' : t.subtitle}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Telegram Widget (visible but minimal) */}
          <div id="telegram-login-widget" className="flex justify-center"></div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs leading-relaxed">
              {t.terms}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
