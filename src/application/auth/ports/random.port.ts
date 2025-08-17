export interface RandomPort {
  bytes(n: number): Uint8Array;
  hex(n: number): string;
}
