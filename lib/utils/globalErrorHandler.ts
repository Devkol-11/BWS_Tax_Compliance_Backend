import { Request, Response, NextFunction } from 'express';
import { HttpHelpers } from './httpHelpers.js';
import { httpStatusCode } from './httpStatusCodes.js';
import { InfrastructureError, DomainError } from './appError.js';

export function globalErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
        console.error(err);

        if (err instanceof InfrastructureError) {
                // Infrastructure errors → hide details from client
                return HttpHelpers.sendError(
                        res,
                        httpStatusCode.INTERNAL_SERVER_ERROR,
                        'Internal server error'
                );
        }

        if (err instanceof DomainError) {
                // Business errors → send actual status and message
                return HttpHelpers.sendError(res, err.statusCode, err.message);
        }

        // Unknown / unexpected errors → generic 500
        return HttpHelpers.sendError(res, httpStatusCode.INTERNAL_SERVER_ERROR, 'Unexpected error occurred');
}
