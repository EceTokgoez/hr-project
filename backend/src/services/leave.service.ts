import { LeaveDurationType } from '@prisma/client';
import { prisma } from '../prisma';
import { calculateLeaveDurationInDays, calculateLeaveDurationInHours } from '../utils/calculateLeaveDuration';

interface CreateLeaveInput {
  leaveType: string;
  durationType: LeaveDurationType;
  startDate: Date;
  endDate: Date;
  description: string;
}

export async function createLeaveRequest(employeeId: string, input: CreateLeaveInput) {
  const leaveDuration =
    input.durationType === 'HOURLY'
      ? calculateLeaveDurationInHours(input.startDate, input.endDate)
      : calculateLeaveDurationInDays(input.startDate, input.endDate);

  return prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveType: input.leaveType,
      durationType: input.durationType,
      startDate: input.startDate,
      endDate: input.endDate,
      leaveDuration,
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
