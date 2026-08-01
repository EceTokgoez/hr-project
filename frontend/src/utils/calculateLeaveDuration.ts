const MS_PER_DAY = 1000 * 60 * 60 * 24
const MS_PER_HOUR = 1000 * 60 * 60

export function calculateLeaveDurationInDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const dayDifference = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY)
  return dayDifference + 1
}

export function calculateLeaveDurationInHours(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / MS_PER_HOUR)
}
