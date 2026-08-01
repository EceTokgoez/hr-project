import { createContext, useEffect, useState, type ReactNode } from 'react'
import * as authService from '../services/authService'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'hr_leave_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as { user: User; token: string }
      setUser(parsed.user)
      setToken(parsed.token)
    }
    setIsLoading(false)
  }, [])

  async function login(email: string, password: string) {
    const result = await authService.login(email, password)
    setUser(result.user)
    setToken(result.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
