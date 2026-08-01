import { useCallback, useEffect, useState } from 'react'
import { LeaveStatusBadge } from '../components/LeaveStatusBadge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { approveLeaveRequest, getPendingRequests, rejectLeaveRequest } from '../services/managerService'
import type { LeaveRequest } from '../types'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

export function ManagerDashboardPage() {
  const { token } = useAuth()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionError, setActionError] = useState('')

  const loadRequests = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    const data = await getPendingRequests(token)
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

  return (
    <DashboardLayout>
      <h2 className="mb-4 text-base font-semibold text-slate-800">Bekleyen İzin Talepleri</h2>

      {actionError && <p className="mb-4 text-sm text-red-500">{actionError}</p>}

      {isLoading ? (
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      ) : requests.length === 0 ? (
        <Card className="text-center text-sm text-slate-500">Bekleyen izin talebi bulunmuyor.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {request.employee?.fullName} · {request.leaveType}
                </p>
                <p className="text-sm text-slate-500">
                  {request.employee?.department} · {formatDate(request.startDate)} -{' '}
                  {formatDate(request.endDate)} · {request.leaveDuration}{' '}
                  {request.durationType === 'HOURLY' ? 'saat' : 'gün'}
                </p>
                {request.description && (
                  <p className="mt-1 text-sm text-slate-400">{request.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <LeaveStatusBadge status={request.status} />
                <Button variant="secondary" onClick={() => handleApprove(request.id)}>
                  Onayla
                </Button>
                <Button variant="danger" onClick={() => handleReject(request.id)}>
                  Reddet
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
