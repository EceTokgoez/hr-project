const MS_PER_DAY = 1000 * 60 * 60 * 24

export function calculateLeaveDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const dayDifference = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY)
  return dayDifference + 1
}
