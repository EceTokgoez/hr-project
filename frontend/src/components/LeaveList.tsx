import type { LeaveRequest } from '../types'
import { LeaveStatusBadge } from './LeaveStatusBadge'
import { Card } from './ui/Card'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

export function LeaveList({ leaveRequests }: { leaveRequests: LeaveRequest[] }) {
  if (leaveRequests.length === 0) {
    return <Card className="text-center text-sm text-slate-500">Henüz izin talebiniz bulunmuyor.</Card>
  }

  return (
    <div className="flex flex-col gap-3">
      {leaveRequests.map((leave) => (
        <Card key={leave.id} className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-slate-800">{leave.leaveType}</p>
            <p className="text-sm text-slate-500">
              {formatDate(leave.startDate)} - {formatDate(leave.endDate)} · {leave.leaveDuration}{' '}
              {leave.durationType === 'HOURLY' ? 'saat' : 'gün'}
            </p>
            {leave.description && <p className="mt-1 text-sm text-slate-400">{leave.description}</p>}
          </div>
          <LeaveStatusBadge status={leave.status} />
        </Card>
      ))}
    </div>
  )
}
