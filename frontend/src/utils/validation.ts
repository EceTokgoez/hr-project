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
    leaveType: z.string().min(1, 'İzin türü seçiniz.'),
    startDate: z.string().min(1, 'Başlangıç tarihi zorunludur.'),
    endDate: z.string().min(1, 'Bitiş tarihi zorunludur.'),
    description: z.string().max(300, 'Açıklama en fazla 300 karakter olabilir.'),
  })
  .refine((data) => new Date(data.startDate) >= getStartOfToday(), {
    message: 'Başlangıç tarihi bugünden eski olamaz.',
    path: ['startDate'],
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'Bitiş tarihi başlangıç tarihinden önce olamaz.',
    path: ['endDate'],
  })

export type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>
