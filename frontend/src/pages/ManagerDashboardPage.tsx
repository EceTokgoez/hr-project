import { useCallback, useEffect, useState } from 'react'
import { LeaveStatusBadge } from '../components/LeaveStatusBadge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { approveLeaveRequest, getRequests, rejectLeaveRequest } from '../services/managerService'
import type { LeaveRequest } from '../types'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

interface RequestCardProps {
  request: LeaveRequest
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

function RequestCard({ request, onApprove, onReject }: RequestCardProps) {
  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-slate-800">
          {request.employee?.fullName} · {request.leaveType}
        </p>
        <p className="text-sm text-slate-500">
          {request.employee?.department} · {formatDate(request.startDate)} - {formatDate(request.endDate)} ·{' '}
          {request.leaveDuration} {request.durationType === 'HOURLY' ? 'saat' : 'gün'}
        </p>
        {request.description && <p className="mt-1 text-sm text-slate-400">{request.description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <LeaveStatusBadge status={request.status} />
        {onApprove && onReject && (
          <>
            <Button variant="secondary" onClick={() => onApprove(request.id)}>
              Onayla
            </Button>
            <Button variant="danger" onClick={() => onReject(request.id)}>
              Reddet
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}

export function ManagerDashboardPage() {
  const { token } = useAuth()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionError, setActionError] = useState('')

  const loadRequests = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    const data = await getRequests(token)
    setRequests(data)
    setIsLoading(false)
  }, [token])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  async function handleApprove(id: string) {
    if (!token) return
    setActionError('')
    try {
      await approveLeaveRequest(token, id)
      loadRequests()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Bir hata oluştu.')
    }
  }

  async function handleReject(id: string) {
    if (!token) return
    setActionError('')
    try {
      await rejectLeaveRequest(token, id)
      loadRequests()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Bir hata oluştu.')
    }
  }

  const pendingRequests = requests.filter((request) => request.status === 'PENDING')
  const processedRequests = requests.filter((request) => request.status !== 'PENDING')

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {actionError && <p className="mb-4 text-sm text-red-500">{actionError}</p>}

      <div className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Bekleyen Talepler</h2>
        {pendingRequests.length === 0 ? (
          <Card className="text-center text-sm text-slate-500">Bekleyen izin talebi bulunmuyor.</Card>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} onApprove={handleApprove} onReject={handleReject} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold text-slate-800">İşleme Alınan Talepler</h2>
        {processedRequests.length === 0 ? (
          <Card className="text-center text-sm text-slate-500">İşleme alınan izin talebi bulunmuyor.</Card>
        ) : (
          <div className="flex flex-col gap-3">
            {processedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
