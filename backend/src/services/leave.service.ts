import { prisma } from '../prisma';
import { calculateLeaveDuration } from '../utils/calculateLeaveDuration';

interface CreateLeaveInput {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

export async function createLeaveRequest(employeeId: string, input: CreateLeaveInput) {
  return prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveType: input.leaveType,
      startDate: input.startDate,
      endDate: input.endDate,
      leaveDuration: calculateLeaveDuration(input.startDate, input.endDate),
      description: input.description,
    },
  });
}

export async function getMyLeaveRequests(employeeId: string) {
  return prisma.leaveRequest.findMany({
    where: { employeeId },
    orderBy: { createdAt: 'desc' },
  });
}
