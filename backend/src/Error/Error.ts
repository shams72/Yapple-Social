import { Request, Response, NextFunction } from "express";

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ErrorHandler {
  static errorMiddleware(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
      error: {
        message,
        status,
      },
    });
  }
}

export { CustomError, ErrorHandler };
