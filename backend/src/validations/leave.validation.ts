import { z } from 'zod';

function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

const baseLeaveSchema = z.object({
  leaveType: z.string().min(1, 'İzin türü zorunludur.'),
  description: z.string().max(300, 'Açıklama en fazla 300 karakter olabilir.'),
});

const dailyLeaveSchema = baseLeaveSchema.extend({
  durationType: z.literal('DAILY'),
  startDate: z.coerce.date({ message: 'Geçerli bir başlangıç tarihi giriniz.' }),
  endDate: z.coerce.date({ message: 'Geçerli bir bitiş tarihi giriniz.' }),
});

const hourlyLeaveSchema = baseLeaveSchema.extend({
  durationType: z.literal('HOURLY'),
  startDate: z.coerce.date({ message: 'Geçerli bir başlangıç saati giriniz.' }),
  endDate: z.coerce.date({ message: 'Geçerli bir bitiş saati giriniz.' }),
});

export const createLeaveSchema = z
  .discriminatedUnion('durationType', [dailyLeaveSchema, hourlyLeaveSchema])
  .refine((data) => data.endDate > data.startDate, {
    message: 'Bitiş, başlangıçtan önce olamaz.',
    path: ['endDate'],
  })
  .refine(
    (data) => (data.durationType === 'DAILY' ? data.startDate >= getStartOfToday() : data.startDate >= new Date()),
    {
      message: 'Başlangıç, geçmiş bir zaman olamaz.',
      path: ['startDate'],
    },
  )
  .refine((data) => (data.durationType === 'HOURLY' ? isSameCalendarDay(data.startDate, data.endDate) : true), {
    message: 'Saatlik izinde başlangıç ve bitiş aynı gün içinde olmalıdır.',
    path: ['endDate'],
  });
