import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
import { AppError } from '../utils/AppError';

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      throw new AppError(400, firstIssue.message);
    }

    req.body = result.data;
    next();
  };
}
