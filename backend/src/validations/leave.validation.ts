import { z } from 'zod';

function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const createLeaveSchema = z
  .object({
    leaveType: z.string().min(1, 'İzin türü zorunludur.'),
    startDate: z.coerce.date({ message: 'Geçerli bir başlangıç tarihi giriniz.' }),
    endDate: z.coerce.date({ message: 'Geçerli bir bitiş tarihi giriniz.' }),
    description: z.string().max(300, 'Açıklama en fazla 300 karakter olabilir.'),
  })
  .refine((data) => data.startDate >= getStartOfToday(), {
    message: 'Başlangıç tarihi bugünden eski olamaz.',
    path: ['startDate'],
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'Bitiş tarihi başlangıç tarihinden önce olamaz.',
    path: ['endDate'],
  });
