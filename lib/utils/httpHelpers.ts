import { Response } from 'express';

export class HttpHelpers {
        static sendResponse(res: Response, statusCode: number, data: any) {
                res.status(statusCode).json({
                        status: 'success',
                        data
                });
        }
        static sendError(res: Response, statusCode: number, error: any) {
                res.status(statusCode).json({
                        status: 'error',
                        error
                });
        }
}
