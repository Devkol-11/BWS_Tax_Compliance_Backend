import { Request, Response, NextFunction } from 'express';
import { HttpHelpers } from './httpHelpers';
import { AppError } from './appError';

export function globalErrorHandler(err: AppError & Error, _req: Request, res: Response, _next: NextFunction) {
        if (err instanceof AppError) {
                HttpHelpers.sendError(res, err.statusCode, err.message);
        }
        HttpHelpers.sendError(res, err.statusCode, err.message);
}
