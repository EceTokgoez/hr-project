import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRole: Role
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'MANAGER' ? '/manager' : '/employee'} replace />
  }

  return <>{children}</>
}
