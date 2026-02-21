import { WS_URL } from '../config'
import apiService from './api'

class RealtimeService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Function[]> = new Map()

  constructor() {
    this.connect()
  }

  private connect() {
    try {
      const token = apiService.getToken()
      const wsUrl = `${WS_URL}/ws${token ? `?token=${token}` : ''}`
      
      console.log('🔌 Connecting to WebSocket:', wsUrl)
      
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected')
        this.reconnectAttempts = 0
        this.reconnectDelay = 1000
        
        // Send authentication token if available
        if (token) {
          this.send('auth', { token })
        }
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📨 WebSocket message:', data)
          this.emit(data.type, data.payload)
        } catch (error) {
          console.error('❌ WebSocket message error:', error)
        }
      }
      
      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        this.attemptReconnect()
      }
      
      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
      }
    } catch (error) {
      console.error('❌ WebSocket connection error:', error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
      
      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay)
      
      this.reconnectDelay *= 2
    } else {
      console.error('❌ Max reconnection attempts reached')
    }
  }

  private emit(type: string, payload: any) {
    const listeners = this.listeners.get(type) || []
    listeners.forEach(listener => {
      try {
        listener(payload)
      } catch (error) {
        console.error('❌ Listener error:', error)
      }
    })
  }

  public on(type: string, listener: Function) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type)!.push(listener)
  }

  public off(type: string, listener: Function) {
    const listeners = this.listeners.get(type)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  public send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
      console.log('📤 WebSocket sent:', { type, payload })
    } else {
      console.warn('⚠️ WebSocket not connected, message not sent:', { type, payload })
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export default new RealtimeService()
