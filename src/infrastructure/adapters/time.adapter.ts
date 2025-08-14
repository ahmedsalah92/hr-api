// src/infrastructure/adapters/time.adapter.ts
import type { TimePort } from 'src/application/auth/ports/time.port';
export class SystemTimeAdapter implements TimePort {
  now(): Date {
    return new Date();
  }
  addMs(d: number): Date {
    return new Date(Date.now() + d);
  }
}
