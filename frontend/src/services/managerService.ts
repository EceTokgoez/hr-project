import { apiRequest } from './api'
import type { LeaveRequest } from '../types'

export function getRequests(token: string) {
  return apiRequest<LeaveRequest[]>('/manager/requests', { token })
}

export function approveLeaveRequest(token: string, id: string) {
  return apiRequest<LeaveRequest>(`/manager/approve/${id}`, { method: 'PUT', token })
}

export function rejectLeaveRequest(token: string, id: string) {
  return apiRequest<LeaveRequest>(`/manager/reject/${id}`, { method: 'PUT', token })
}
