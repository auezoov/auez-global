import { API_BASE_URL } from '../config'

const API_URL = API_BASE_URL

export interface User {
  id: number
  name: string
  phone: string
  balance: number
}

export interface PC {
  id: number
  pc_id: string
  zone: string
  status: string
  current_user: string | null
  session_start: string | null
  created_at: string
  updated_at: string
}

export interface Shift {
  id: number
  admin_name: string
  shift_start: string
  shift_end: string | null
  total_income: number
  notes: string
  created_at: string
}

class ApiService {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auez_token', token)
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auez_token')
    }
    return this.token
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auez_token')
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response
  }

  // Telegram authentication
  async telegramAuth(userData: any): Promise<{ token: string; user: any }> {
    const response = await this.request('/api/auth/telegram', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    const data = await response.json()
    this.setToken(data.token)
    return data
  }

  // Phone authentication
  async requestCode(phone: string): Promise<{ message: string }> {
    const response = await this.request('/api/auth/request-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    })
    return response.json()
  }

  async verifyCode(phone: string, code: string): Promise<{ token: string; user: any }> {
    const response = await this.request('/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    })
    const data = await response.json()
    this.setToken(data.token)
    return data
  }

  // User profile operations
  async getUserProfile(): Promise<any> {
    const response = await this.request('/api/user/profile')
    return response.json()
  }

  async getUserBalance(): Promise<{ balance: number }> {
    const response = await this.request('/api/user/balance')
    return response.json()
  }

  async getUserHistory(): Promise<any[]> {
    const response = await this.request('/api/user/history')
    return response.json()
  }

  // User operations (legacy)
  async getUserBalanceLegacy(userId?: number): Promise<number> {
    // Get username from localStorage if no userId provided
    const username = localStorage.getItem('clientUsername')
    const identifier = userId || username
    
    console.log('🔍 Getting balance for identifier:', identifier)
    
    // Send as username parameter since backend expects username=777
    const response = await this.request(`/user/balance?username=${identifier}`)
    const data = await response.json()
    console.log('💰 Balance response:', data)
    return data.balance
  }

  // PC operations
  async getPCs(): Promise<PC[]> {
    const response = await this.request('/api/computers')
    return response.json()
  }

  async updatePCStatus(pcId: string, status: string, customer?: string): Promise<{ success: boolean; pcId: string; status: string }> {
    const response = await this.request(`/api/pcs/${pcId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, customer }),
    })

    return response.json()
  }

  // Shift operations
  async getShifts(): Promise<Shift[]> {
    const response = await this.request('/api/shifts')
    return response.json()
  }

  async startShift(adminName: string): Promise<{ success: boolean; shiftStarted: boolean }> {
    const response = await this.request('/api/shifts/start', {
      method: 'POST',
      body: JSON.stringify({ adminName }),
    })

    return response.json()
  }

  async endShift(shiftId: number): Promise<{ success: boolean; shiftEnded: boolean }> {
    const response = await this.request(`/api/shifts/${shiftId}/end`, {
      method: 'POST',
    })

    return response.json()
  }

  // Admin operations
  async callAdmin(message: string): Promise<{ success: boolean; message: string; timestamp: string }> {
    // const response = await this.request('/api/admin/call', {
    //   method: 'POST',
    //   body: JSON.stringify({ message }),
    // })
    // return response.json()
    
    // Mock response
    return {
      success: true,
      message: 'Admin called successfully',
      timestamp: new Date().toISOString()
    }
  }

  // Heartbeat check for server health
  async heartbeat(): Promise<{ success: boolean; status: string; message?: string }> {
    try {
      // const response = await this.request('/api/heartbeat')
      // const data = await response.json()
      // return data
      
      // Mock response
      return {
        success: true,
        status: 'online',
        message: 'Server is running'
      }
    } catch (error) {
      return {
        success: false,
        status: 'offline',
        message: 'Server unavailable'
      }
    }
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    // const response = await this.request('/api/notifications')
    // return response.json()
    
    // Mock response
    return [
      { id: 1, message: 'Notification 1', timestamp: new Date().toISOString() },
      { id: 2, message: 'Notification 2', timestamp: new Date().toISOString() },
    ]
  }

  // Session operations
  async startSession(userId: number, duration: number = 1): Promise<{ success: boolean; sessionId: number; cost: number; newBalance: number }> {
    // const response = await this.request('/api/session/start', {
    //   method: 'POST',
    //   body: JSON.stringify({ userId, duration }),
    // })
    // return response.json()
    
    // Mock response
    return {
      success: true,
      sessionId: Math.floor(Math.random() * 1000),
      cost: duration * 10,
      newBalance: 1000 - (duration * 10)
    }
  }

  async getActiveSession(userId: number): Promise<{ success: boolean; session: any }> {
    // const response = await this.request(`/api/session/active?userId=${userId}`)
    // return response.json()
    
    // Mock response
    return {
      success: true,
      session: {
        id: Math.floor(Math.random() * 1000),
        userId,
        duration: 1,
        cost: 10,
        newBalance: 1000 - 10
      }
    }
  }

  // Shop operations
  async getShopItems(): Promise<{ items: any[] }> {
    // const response = await this.request('/api/shop/items')
    // return response.json()
    
    // Mock response
    return {
      items: [
        { id: 1, name: 'Кофе', price: 50, category: 'drinks' },
        { id: 2, name: 'Чай', price: 30, category: 'drinks' },
        { id: 3, name: 'Бутерброд', price: 80, category: 'food' },
        { id: 4, name: 'Чипсы', price: 60, category: 'snacks' }
      ]
    }
  }

  async purchaseItem(userId: number, itemId: number, quantity: number = 1): Promise<{ success: boolean; item: string; quantity: number; totalCost: number; newBalance: number }> {
    const response = await this.request('/api/shop/purchase', {
      method: 'POST',
      body: JSON.stringify({ userId, itemId, quantity }),
    })
    return response.json()
  }

  // Tariff operations
  async getTariffs(): Promise<{ tariffs: any[] }> {
    const response = await this.request('/api/tariffs')
    return response.json()
  }

  // Balance operations
  async topUpBalance(userId: number, amount: number): Promise<{ success: boolean; amount: number; newBalance: number }> {
    const response = await this.request('/api/balance/topup', {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    })
    return response.json()
  }

  // Enhanced authentication
  async authLogin(username: string, password: string): Promise<{ success: boolean; user: any; token: string; redirect: string }> {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  }

  // Role-based access
  async getAdminPanel(): Promise<{ success: boolean; message: string; user: any }> {
    const response = await this.request('/api/admin/panel')
    return response.json()
  }

  async getClientDashboard(): Promise<{ success: boolean; message: string; user: any }> {
    const response = await this.request('/api/client/dashboard')
    return response.json()
  }

  // Finance operations
  async getFinanceData(): Promise<{ todayRevenue: number; totalSessions: number; popularPC: string; newCustomers: number }> {
    const response = await this.request('/api/finance')
    return response.json()
  }

  // Computer operations for MongoDB integration
  async getComputers(): Promise<any[]> {
    const response = await this.request('/api/computers')
    return response.json()
  }

  async updateComputerStatus(computerId: string, status: string): Promise<any> {
    const response = await this.request(`/api/computers/${computerId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return response.json()
  }

  async bookComputer(computerId: string, userId: string, duration: number): Promise<any> {
    const response = await this.request(`/api/computers/${computerId}/book`, {
      method: 'POST',
      body: JSON.stringify({ userId, duration }),
    })
    return response.json()
  }

  async getComputerBookings(computerId: string): Promise<any[]> {
    const response = await this.request(`/api/computers/${computerId}/bookings`)
    return response.json()
  }
}

export default new ApiService()
