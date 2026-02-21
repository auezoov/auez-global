class RealtimeService {
  private listeners: Map<string, Function[]> = new Map()

  constructor() {
    // WebSocket server not implemented on backend, disabling
    console.log('🔌 WebSocket disabled - backend server not implemented')
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
    // WebSocket disabled - no-op
    console.log('📤 WebSocket disabled, message not sent:', { type, payload })
  }

  public disconnect() {
    // WebSocket disabled - no-op
    console.log('🔌 WebSocket disabled - no disconnect needed')
  }
}

export default new RealtimeService()
