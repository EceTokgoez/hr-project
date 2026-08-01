import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../utils/validation'

export function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    if (user) {
      navigate(user.role === 'MANAGER' ? '/manager' : '/employee', { replace: true })
    }
  }, [user, navigate])

  async function onSubmit(values: LoginFormValues) {
    setLoginError('')
    try {
      await login(values.email, values.password)
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Giriş başarısız.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold text-slate-800">İzin Yönetim Sistemi</h1>
        <p className="mb-6 text-sm text-slate-500">Devam etmek için giriş yapın</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="E-posta" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Şifre" type="password" error={errors.password?.message} {...register('password')} />

          {loginError && <p className="text-sm text-red-500">{loginError}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
