// Prepared for Stage C (password reset flows); keeping it here so use cases can depend on it later.
export type PasswordResetRequest = {
  id: string; // internal id
  userId: string;
  selector: string; // public part
  verifierHash: string; // hashed secret part
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
};

export interface PasswordResetRepositoryPort {
  create(
    userId: string,
    selector: string,
    verifierHash: string,
    expiresAt: Date,
  ): Promise<string>; // returns id
  findBySelector(selector: string): Promise<PasswordResetRequest | null>;
  markConsumed(id: string, at: Date): Promise<void>;
  purgeExpired(now: Date): Promise<number>;
}
