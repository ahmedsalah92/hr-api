import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

type CorrelatedRequest = Request & { correlationId?: string };

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: CorrelatedRequest, res: Response, next: () => void): void {
    const incoming = (req.headers[CORRELATION_ID_HEADER] as string) ?? uuid();
    req.correlationId = incoming;
    res.setHeader(CORRELATION_ID_HEADER, incoming);
    next();
  }
}
