import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { HttpHelpers } from '@lib/utils/httpHelpers';
import { httpStatusCode } from '@lib/utils/httpStatusCodes';

export const validateRequest = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
                const error = result.error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message
                }));
                return HttpHelpers.sendError(res, httpStatusCode.BAD_REQUEST, error);
        }
        // Replace body with validated & parsed data
        req.body = result.data;

        next();
};

export const validateQuery = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
                const error = {
                        message: 'Invalid Query parameters',
                        errors: result.error.flatten
                };
                return HttpHelpers.sendError(res, httpStatusCode.BAD_REQUEST, error);
        }

        (req as any).query = result.data;
        next();
};
