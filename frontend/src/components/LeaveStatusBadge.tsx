import type { LeaveStatus } from '../types'

const statusStyles: Record<LeaveStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
}

const statusLabels: Record<LeaveStatus, string> = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
}

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}
