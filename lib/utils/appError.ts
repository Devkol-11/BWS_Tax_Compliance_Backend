import { httpStatusCode } from './httpStatusCodes.js';

export abstract class BackendError extends Error {
        abstract readonly kind: 'Business' | 'Infrastructure';
}

export class InfrastructureError extends BackendError {
        readonly kind: 'Infrastructure' = 'Infrastructure';
        readonly retryable: boolean;
        readonly cause?: Error;

        constructor(message: string, retryable: boolean, cause?: Error) {
                super(message);
                this.retryable = retryable;
                this.cause = cause;
        }
}

export class DomainError extends BackendError {
        readonly kind: 'Business' = 'Business';
        readonly statusCode: number;

        constructor(message: string, statusCode: number) {
                super(message);
                this.statusCode = statusCode;
        }
}

export class InvalidRequestError extends DomainError {
        constructor(message: string, statusCode = httpStatusCode.BAD_REQUEST) {
                super(message, statusCode);
        }
}
