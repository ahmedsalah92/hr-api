// src/infrastructure/adapters/random.adapter.ts
import type { RandomPort } from 'src/application/auth/ports/random.port';
export class CryptoRandomAdapter implements RandomPort {
  bytes(n: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(n));
  }
  hex(n: number): string {
    return Buffer.from(this.bytes(n)).toString('hex');
  }
}
