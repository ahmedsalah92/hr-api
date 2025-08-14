export interface TotpPort {
  generateSecret(): string;
  keyUri(email: string, issuer: string, secret: string): string;
  verify(token: string, secret: string, window?: number): boolean;
}
