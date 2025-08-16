export type RefreshRevokeReason = 'ROTATED' | 'LOGOUT' | 'REUSE_DETECTED';

export type RefreshTokenRecord = {
  id: string; // jti
  userId: string;
  familyId: string; // stable id across rotations
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedBy: string | null; // new jti when rotated
  userAgentHash: string | null; // optional device binding
  ipHash: string | null; // optional IP binding
};

export type CreateRefreshTokenInput = {
  id: string;
  userId: string;
  familyId: string;
  issuedAt: Date;
  expiresAt: Date;
  userAgentHash?: string | null;
  ipHash?: string | null;
};

export interface RefreshTokenRepositoryPort {
  create(input: CreateRefreshTokenInput): Promise<void>;

  findById(id: string): Promise<RefreshTokenRecord | null>;

  // Mark token as revoked, preserving reason in audit trail (infra concern)
  revoke(id: string, at: Date, reason: RefreshRevokeReason): Promise<void>;

  // Link rotation chain (old -> new)
  linkRotation(oldId: string, newId: string): Promise<void>;

  // Revoke all tokens in the family (idempotent)
  revokeFamily(
    userId: string,
    familyId: string,
    at: Date,
    reason: RefreshRevokeReason,
  ): Promise<number>;
}
