import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type CorrelatedRequest = Request & { correlationId?: string };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<CorrelatedRequest>();
    const correlationId = req?.correlationId;

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = isHttp
      ? exception.getResponse()
      : { message: 'Internal Server Error' };

    res.status(status).json({
      statusCode: status,
      error: isHttp ? exception.name : 'InternalServerError',
      message:
        (payload as Record<string, unknown> & { message?: string }).message ??
        payload,
      path: req?.url,
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
}
