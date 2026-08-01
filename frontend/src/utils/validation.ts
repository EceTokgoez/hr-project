import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(1, 'Şifre zorunludur.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

function getStartOfToday(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const leaveRequestSchema = z
  .object({
    durationType: z.enum(['DAILY', 'HOURLY']),
    leaveType: z.string().min(1, 'İzin türü seçiniz.'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    date: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    description: z.string().max(300, 'Açıklama en fazla 300 karakter olabilir.'),
  })
  .superRefine((data, ctx) => {
    if (data.durationType === 'DAILY') {
      if (!data.startDate) {
        ctx.addIssue({ code: 'custom', message: 'Başlangıç tarihi zorunludur.', path: ['startDate'] })
      } else if (new Date(data.startDate) < getStartOfToday()) {
        ctx.addIssue({ code: 'custom', message: 'Başlangıç tarihi bugünden eski olamaz.', path: ['startDate'] })
      }

      if (!data.endDate) {
        ctx.addIssue({ code: 'custom', message: 'Bitiş tarihi zorunludur.', path: ['endDate'] })
      } else if (data.startDate && new Date(data.endDate) < new Date(data.startDate)) {
        ctx.addIssue({ code: 'custom', message: 'Bitiş tarihi başlangıç tarihinden önce olamaz.', path: ['endDate'] })
      }
      return
    }

    if (!data.date) {
      ctx.addIssue({ code: 'custom', message: 'İzin tarihi zorunludur.', path: ['date'] })
    }
    if (!data.startTime) {
      ctx.addIssue({ code: 'custom', message: 'Başlangıç saati zorunludur.', path: ['startTime'] })
    }
    if (!data.endTime) {
      ctx.addIssue({ code: 'custom', message: 'Bitiş saati zorunludur.', path: ['endTime'] })
    }

    if (data.date && data.startTime && data.endTime) {
      const start = new Date(`${data.date}T${data.startTime}`)
      const end = new Date(`${data.date}T${data.endTime}`)

      if (start < new Date()) {
        ctx.addIssue({ code: 'custom', message: 'Başlangıç saati geçmiş bir zaman olamaz.', path: ['startTime'] })
      }
      if (end <= start) {
        ctx.addIssue({ code: 'custom', message: 'Bitiş saati başlangıçtan sonra olmalıdır.', path: ['endTime'] })
      }
    }
  })

export type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>
