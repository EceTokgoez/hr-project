import type { ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">İzin Yönetim Sistemi</h1>
            {user && (
              <p className="text-sm text-slate-500">
                {user.fullName} · {user.role === 'MANAGER' ? 'Yönetici' : 'Personel'}
              </p>
            )}
          </div>
          <Button variant="secondary" onClick={logout}>
            Çıkış Yap
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  )
}
