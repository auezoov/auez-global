import { useState, useEffect } from 'react'

export default function TelegramLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load Telegram Login Widget script once
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
      // Cleanup only if script exists
      if (widgetContainer && widgetContainer.contains(script)) {
        widgetContainer.removeChild(script)
      }
    }
  }, []) // Empty dependency array - run only once

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56c-.21 2.25-1.12 7.68-1.58 10.18-.2 1.07-.58 1.43-.96 1.46-.82.07-1.44-.54-2.23-1.06-1.23-.81-1.93-1.31-3.12-2.1-1.38-.9-.49-1.39.3-2.2.21-.21 3.77-3.46 3.83-3.75.01-.04.01-.19-.07-.27s-.2-.06-.29-.03c-.12.04-2.09 1.33-5.91 3.9-.56.38-1.06.57-1.52.56-.5-.01-1.46-.28-2.18-.51-.88-.28-1.57-.43-1.51-.91.03-.25.38-.51 1.05-.78 4.11-1.79 6.85-2.97 8.22-3.55 3.92-1.63 4.73-1.91 5.26-1.92.12 0 .37.03.53.17.14.12.18.28.2.44.01.08.01.16 0 .24z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to AUEZ Club</h1>
          <p className="text-blue-200">Login with Telegram to continue</p>
        </div>

        <div className="flex justify-center mb-6">
          <div id="telegram-login-widget"></div>
        </div>

        {isLoading && (
          <div className="text-center text-white">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <p className="mt-2 text-sm">Authenticating...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-blue-200 text-sm">
            By logging in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}
