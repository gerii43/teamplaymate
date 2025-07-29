export interface ApiResponseData<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
    requestId?: string;
  };
}

export class ApiResponse<T = any> {
  public success: boolean;
  public data?: T;
  public message?: string;
  public errors?: any[];
  public meta: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
    requestId?: string;
  };

  constructor(
    success: boolean,
    data?: T,
    message?: string,
    errors?: any[],
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errors = errors;
    this.meta = {
      timestamp: new Date().toISOString(),
      pagination,
    };
  }

  static success<T>(data?: T, message?: string): ApiResponse<T> {
    return new ApiResponse(true, data, message);
  }

  static error(message: string, errors?: any[]): ApiResponse {
    return new ApiResponse(false, undefined, message, errors);
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    const pagination = { page, limit, total, totalPages };
    
    return new ApiResponse(true, data, message, undefined, pagination);
  }
}

// Helper functions for common responses
export const successResponse = <T>(data?: T, message?: string) => 
  ApiResponse.success(data, message);

export const errorResponse = (message: string, errors?: any[]) => 
  ApiResponse.error(message, errors);

export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
) => ApiResponse.paginated(data, page, limit, total, message);

export const createdResponse = <T>(data: T, message = 'Resource created successfully') =>
  ApiResponse.success(data, message);

export const updatedResponse = <T>(data: T, message = 'Resource updated successfully') =>
  ApiResponse.success(data, message);

export const deletedResponse = (message = 'Resource deleted successfully') =>
  ApiResponse.success(undefined, message);

export const notFoundResponse = (message = 'Resource not found') =>
  ApiResponse.error(message);

export const validationErrorResponse = (errors: any[], message = 'Validation failed') =>
  ApiResponse.error(message, errors);