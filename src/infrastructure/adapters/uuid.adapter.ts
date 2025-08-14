import type { UuidPort } from 'src/application/auth/ports/uuid.port';
export class CryptoUuidAdapter implements UuidPort {
  v4(): string {
    return crypto.randomUUID();
  }
}
