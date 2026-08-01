export type Role = 'EMPLOYEE' | 'MANAGER'
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface User {
  id: string
  fullName: string
  email: string
  role: Role
}

export interface LeaveRequest {
  id: string
  leaveType: string
  startDate: string
  endDate: string
  leaveDuration: number
  description: string
  status: LeaveStatus
  createdAt: string
  employeeId: string
  employee?: {
    id: string
    fullName: string
    department: string
  }
}

export const LEAVE_TYPES = ['Yıllık İzin', 'Hastalık İzni', 'Mazeret İzni', 'Ücretsiz İzin'] as const
