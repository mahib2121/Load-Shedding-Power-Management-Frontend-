export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  data: null;
  meta?: unknown;
}

export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(message: string, statusCode: number, data: unknown = null) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}
