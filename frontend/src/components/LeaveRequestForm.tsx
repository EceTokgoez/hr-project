import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { createLeaveRequest } from '../services/leaveService'
import { LEAVE_TYPES } from '../types'
import { calculateLeaveDuration } from '../utils/calculateLeaveDuration'
import { leaveRequestSchema, type LeaveRequestFormValues } from '../utils/validation'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Textarea } from './ui/Textarea'

export function LeaveRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const { token } = useAuth()
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: { leaveType: '', startDate: '', endDate: '', description: '' },
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const duration =
    startDate && endDate && new Date(endDate) >= new Date(startDate)
      ? calculateLeaveDuration(startDate, endDate)
      : null

  async function onSubmit(values: LeaveRequestFormValues) {
    if (!token) return
    setSubmitError('')
    try {
      await createLeaveRequest(token, values)
      reset()
      onSuccess()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Select label="İzin Türü" error={errors.leaveType?.message} {...register('leaveType')}>
        <option value="">Seçiniz</option>
        {LEAVE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="date"
          label="Başlangıç Tarihi"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input type="date" label="Bitiş Tarihi" error={errors.endDate?.message} {...register('endDate')} />
      </div>

      <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
        İzin Süresi: <span className="font-medium">{duration ? `${duration} gün` : '-'}</span>
      </div>

      <Textarea
        label="Açıklama"
        placeholder="İzin talebinizle ilgili açıklama yazınız (maks. 300 karakter)"
        error={errors.description?.message}
        {...register('description')}
      />

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Gönderiliyor...' : 'İzin Talebi Oluştur'}
      </Button>
    </form>
  )
}
