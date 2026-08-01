import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as managerService from '../services/manager.service';

export const getRequests = asyncHandler(async (req: Request, res: Response) => {
  const managerId = req.user!.id;
  const data = await managerService.getRequestsForManager(managerId);
  res.status(200).json({ data });
});

export const approveRequest = asyncHandler(async (req: Request, res: Response) => {
  const managerId = req.user!.id;
  const data = await managerService.approveLeaveRequest(managerId, req.params.id as string);
  res.status(200).json({ data });
});

export const rejectRequest = asyncHandler(async (req: Request, res: Response) => {
  const managerId = req.user!.id;
  const data = await managerService.rejectLeaveRequest(managerId, req.params.id as string);
  res.status(200).json({ data });
});
