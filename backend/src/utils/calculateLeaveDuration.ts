const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;

export function calculateLeaveDurationInDays(startDate: Date, endDate: Date): number {
  const dayDifference = Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
  return dayDifference + 1;
}

export function calculateLeaveDurationInHours(startDate: Date, endDate: Date): number {
  return Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_HOUR);
}
