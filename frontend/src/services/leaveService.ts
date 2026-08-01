import { apiRequest } from './api'
import type { LeaveDurationType, LeaveRequest } from '../types'

interface CreateLeaveInput {
  leaveType: string
  durationType: LeaveDurationType
  startDate: string
  endDate: string
  description: string
}

export function createLeaveRequest(token: string, input: CreateLeaveInput) {
  return apiRequest<LeaveRequest>('/leave', {
    method: 'POST',
    body: input,
    token,
  })
}

export function getMyLeaveRequests(token: string) {
  return apiRequest<LeaveRequest[]>('/leave/my', { token })
}
