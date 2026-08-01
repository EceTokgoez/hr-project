import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { createLeaveRequest } from '../services/leaveService'
import { LEAVE_TYPES } from '../types'
import { calculateLeaveDurationInDays, calculateLeaveDurationInHours } from '../utils/calculateLeaveDuration'
import { leaveRequestSchema, type LeaveRequestFormValues } from '../utils/validation'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Textarea } from './ui/Textarea'

export function LeaveRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const { token, user } = useAuth()
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      durationType: 'DAILY',
      leaveType: '',
      startDate: '',
      endDate: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
    },
  })

  const durationType = watch('durationType')
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const date = watch('date')
  const startTime = watch('startTime')
  const endTime = watch('endTime')

  const dailyDuration =
    startDate && endDate && new Date(endDate) >= new Date(startDate)
      ? calculateLeaveDurationInDays(startDate, endDate)
      : null

  const hourlyDuration =
    date && startTime && endTime && new Date(`${date}T${endTime}`) > new Date(`${date}T${startTime}`)
      ? calculateLeaveDurationInHours(new Date(`${date}T${startTime}`), new Date(`${date}T${endTime}`))
      : null

  async function onSubmit(values: LeaveRequestFormValues) {
    if (!token) return
    setSubmitError('')

    const payload =
      values.durationType === 'DAILY'
        ? {
            leaveType: values.leaveType,
            durationType: values.durationType,
            startDate: values.startDate as string,
            endDate: values.endDate as string,
            description: values.description,
          }
        : {
            leaveType: values.leaveType,
            durationType: values.durationType,
            startDate: new Date(`${values.date}T${values.startTime}`).toISOString(),
            endDate: new Date(`${values.date}T${values.endTime}`).toISOString(),
            description: values.description,
          }

    try {
      await createLeaveRequest(token, payload)
      reset()
      onSuccess()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Personel Bilgileri</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Ad Soyad" defaultValue={user?.fullName} />
          <Input label="Personel No" defaultValue={user?.employeeNumber} />
          <Input label="E-posta" type="email" defaultValue={user?.email} />
          <Input label="Departman" defaultValue={user?.department} />
          <Input label="Bağlı Olduğu Yönetici" defaultValue={user?.managerName ?? ''} className="sm:col-span-2" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">İzin Detayları</h3>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1 rounded-lg bg-blue-50 p-1">
            <label
              className={`flex-1 cursor-pointer rounded-md py-2 text-center text-sm font-medium transition-colors ${
                durationType === 'DAILY' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              <input type="radio" value="DAILY" className="sr-only" {...register('durationType')} />
              Günlük
            </label>
            <label
              className={`flex-1 cursor-pointer rounded-md py-2 text-center text-sm font-medium transition-colors ${
                durationType === 'HOURLY' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              <input type="radio" value="HOURLY" className="sr-only" {...register('durationType')} />
              Saatlik
            </label>
          </div>

          {durationType === 'DAILY' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="date"
                label="Başlangıç Tarihi"
                error={errors.startDate?.message}
                {...register('startDate')}
              />
              <Input type="date" label="Bitiş Tarihi" error={errors.endDate?.message} {...register('endDate')} />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Input type="date" label="İzin Tarihi" error={errors.date?.message} {...register('date')} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  type="time"
                  label="Başlangıç Saati"
                  error={errors.startTime?.message}
                  {...register('startTime')}
                />
                <Input type="time" label="Bitiş Saati" error={errors.endTime?.message} {...register('endTime')} />
              </div>
            </div>
          )}

          <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
            İzin Süresi:{' '}
            <span className="font-medium">
              {durationType === 'DAILY'
                ? dailyDuration
                  ? `${dailyDuration} gün`
                  : '-'
                : hourlyDuration
                  ? `${hourlyDuration} saat`
                  : '-'}
            </span>
          </div>

          <Select label="İzin Türü" error={errors.leaveType?.message} {...register('leaveType')}>
            <option value="">Seçiniz</option>
            {LEAVE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Textarea
            label="Açıklama"
            placeholder="İzin talebinizle ilgili açıklama yazınız (maks. 300 karakter)"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Gönderiliyor...' : 'İzin Talebi Oluştur'}
      </Button>
    </form>
  )
}
