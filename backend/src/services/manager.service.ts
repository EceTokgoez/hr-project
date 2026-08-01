import { LeaveStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { AppError } from '../utils/AppError';

export async function getRequestsForManager(managerId: string) {
  return prisma.leaveRequest.findMany({
    where: { employee: { managerId } },
    orderBy: { createdAt: 'desc' },
    include: {
      employee: { select: { id: true, fullName: true, department: true } },
    },
  });
}

async function updateLeaveStatus(managerId: string, leaveRequestId: string, status: LeaveStatus) {
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id: leaveRequestId },
    include: { employee: true },
  });

  if (!leaveRequest) {
    throw new AppError(404, 'İzin talebi bulunamadı.');
  }

  if (leaveRequest.employee.managerId !== managerId) {
    throw new AppError(403, 'Bu talebi işlem yapma yetkiniz yok.');
  }

  if (leaveRequest.status !== 'PENDING') {
    throw new AppError(409, 'Bu talep zaten sonuçlandırılmış.');
  }

  return prisma.leaveRequest.update({
    where: { id: leaveRequestId },
    data: { status },
  });
}

export function approveLeaveRequest(managerId: string, leaveRequestId: string) {
  return updateLeaveStatus(managerId, leaveRequestId, 'APPROVED');
}

export function rejectLeaveRequest(managerId: string, leaveRequestId: string) {
  return updateLeaveStatus(managerId, leaveRequestId, 'REJECTED');
}
