// Recovery codes are stored hashed.
// Verification is done in the use case via PasswordHasherPort.verify( hash, plain ).
export interface MfaRecoveryRepositoryPort {
  listHashes(userId: string): Promise<readonly string[]>;
  consumeByHash(userId: string, hash: string): Promise<boolean>; // true when a hash was removed
  addHashes(userId: string, hashes: readonly string[]): Promise<void>; // regeneration path
  count(userId: string): Promise<number>;
}
