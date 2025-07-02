export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const createApiError = (statusCode: number, message: string) => {
  return new ApiError(statusCode, message);
};

// Common API errors
export const ApiErrors = {
  BadRequest: (message = 'Bad Request') => new ApiError(400, message),
  Unauthorized: (message = 'Unauthorized') => new ApiError(401, message),
  Forbidden: (message = 'Forbidden') => new ApiError(403, message),
  NotFound: (message = 'Not Found') => new ApiError(404, message),
  Conflict: (message = 'Conflict') => new ApiError(409, message),
  UnprocessableEntity: (message = 'Unprocessable Entity') => new ApiError(422, message),
  TooManyRequests: (message = 'Too Many Requests') => new ApiError(429, message),
  InternalServerError: (message = 'Internal Server Error') => new ApiError(500, message),
  ServiceUnavailable: (message = 'Service Unavailable') => new ApiError(503, message),
};