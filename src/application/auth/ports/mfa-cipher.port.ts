export interface MfaCipherPort {
  encrypt(plain: string): string; // returns iv:ct:tag (base64 segments)
  decrypt(payload: string): string;
}
