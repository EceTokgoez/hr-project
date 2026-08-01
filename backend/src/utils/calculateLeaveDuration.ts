const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calculateLeaveDuration(startDate: Date, endDate: Date): number {
  const dayDifference = Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
  return dayDifference + 1;
}
