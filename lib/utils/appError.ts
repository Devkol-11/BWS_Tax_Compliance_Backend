import { httpStatusCode } from "./httpStatusCodes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, Error);
  }
}

export class InvalidRequestError extends AppError {
  constructor(
    message: string,
    statusCode: number = httpStatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
    Object.setPrototypeOf(this, AppError);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, statusCode: number = httpStatusCode.NOT_FOUND) {
    super(message, statusCode);
    Object.setPrototypeOf(this, AppError);
  }
}
