import { apiRequest } from './api'
import type { User } from '../types'

interface LoginResponse {
  token: string
  user: User
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}
