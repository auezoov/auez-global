export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://auez-backend.onrender.com/api' 
  : '/api'

export const WS_URL = import.meta.env.PROD
  ? 'wss://auez-backend.onrender.com'
  : `ws://${window.location.hostname}:10000`
