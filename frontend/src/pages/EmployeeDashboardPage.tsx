import { useCallback, useEffect, useState } from 'react'
import { LeaveList } from '../components/LeaveList'
import { LeaveRequestForm } from '../components/LeaveRequestForm'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { getMyLeaveRequests } from '../services/leaveService'
import type { LeaveRequest } from '../types'

export function EmployeeDashboardPage() {
  const { token } = useAuth()
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadLeaveRequests = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    const data = await getMyLeaveRequests(token)
    setLeaveRequests(data)
    setIsLoading(false)
  }, [token])

  useEffect(() => {
    loadLeaveRequests()
  }, [loadLeaveRequests])

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-800">Yeni İzin Talebi</h2>
          <LeaveRequestForm onSuccess={loadLeaveRequests} />
        </Card>

        <div>
          <h2 className="mb-4 text-base font-semibold text-slate-800">İzin Taleplerim</h2>
          {isLoading ? (
            <p className="text-sm text-slate-500">Yükleniyor...</p>
          ) : (
            <LeaveList leaveRequests={leaveRequests} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
