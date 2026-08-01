import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { AppError } from '../utils/AppError';

interface JwtPayload {
  id: string;
  role: Role;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Giriş yapmanız gerekiyor.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    throw new AppError(401, 'Oturum geçersiz veya süresi dolmuş.');
  }
}

export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      throw new AppError(403, 'Bu işlem için yetkiniz yok.');
    }
    next();
  };
}
