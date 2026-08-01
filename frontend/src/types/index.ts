export type Role = 'EMPLOYEE' | 'MANAGER'
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type LeaveDurationType = 'DAILY' | 'HOURLY'

export interface User {
  id: string
  fullName: string
  employeeNumber: string
  email: string
  department: string
  managerName: string | null
  role: Role
}

export interface LeaveRequest {
  id: string
  leaveType: string
  durationType: LeaveDurationType
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

export const LEAVE_TYPES = [
  'Yıllık İzin',
  'Hastalık / Rapor İzni',
  'Mazeret İzni',
  'Doğum İzni',
  'Babalık İzni',
  'Evlilik İzni',
  'Ölüm İzni',
  'Refakat İzni',
  'Diğer',
] as const

export const DEPARTMENTS = [
  'Müşteri Hizmetleri Departmanı',
  'Bilgi Teknolojileri ve AR-GE Departmanları',
  'Hukuk Departmanı',
  'İnsan Kaynakları Departmanı',
  'Pazarlama ve Satış Departmanları',
  'Finans Departmanı',
  'Üretim Departmanı',
  'Yönetim Departmanı',
] as const
