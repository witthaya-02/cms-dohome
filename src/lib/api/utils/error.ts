/**
 * ระบบจัดการ errors จาก API
 */
// import { transformResponse } from "./transformer";

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  statusCode: number;
  isSuccess: boolean;
  originalError?: Error;

  constructor({
    message,
    statusCode = 500,
    isSuccess = false,
    originalError,
  }: {
    message: string;
    statusCode?: number;
    isSuccess?: boolean;
    originalError?: Error;
  }) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isSuccess = isSuccess;
    this.originalError = originalError;

    // For better stack traces
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * ตรวจสอบว่า error เป็น unauthorized (status 401) หรือไม่
   */
  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /**
   * ตรวจสอบว่า error เป็น forbidden (status 403) หรือไม่
   */
  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * ตรวจสอบว่า error เป็น not found (status 404) หรือไม่
   */
  isNotFound(): boolean {
    return this.statusCode === 404;
  }
}

/**
 * จัดการกับ error จาก fetch response
 */
export async function handleApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    return new ApiError({
      message: data.message || response.statusText || 'มีข้อผิดพลาดในการเชื่อมต่อกับระบบ',
      statusCode: data.status_code || response.status,
      isSuccess: data.is_success || false,
    });
  } catch (error) {
    return new ApiError({
      message: response.statusText || 'มีข้อผิดพลาดในการเชื่อมต่อกับระบบ',
      statusCode: response.status,
      originalError: error instanceof Error ? error : undefined,
    });
  }
}
