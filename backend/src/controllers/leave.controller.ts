import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as leaveService from '../services/leave.service';

export const createLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const employeeId = req.user!.id;
  const data = await leaveService.createLeaveRequest(employeeId, req.body);
  res.status(201).json({ data });
});

export const getMyLeaveRequests = asyncHandler(async (req: Request, res: Response) => {
  const employeeId = req.user!.id;
  const data = await leaveService.getMyLeaveRequests(employeeId);
  res.status(200).json({ data });
});
