export type MemberPlan = 'base' | 'pro' | 'ultra';

export type AccountRole = 'member' | 'moderator' | 'support' | 'admin' | 'founder';

export type AuthMethodKind = 'password' | 'passkey' | 'oauth';

export interface UserAccount {
  readonly userId: string;
  readonly email: string;
  readonly roles: readonly AccountRole[];
  readonly plan: MemberPlan;
  readonly mfaEnabled: boolean;
}

export interface AuthMethod {
  readonly authMethodId: string;
  readonly userId: string;
  readonly kind: AuthMethodKind;
  readonly createdAt: string;
  readonly lastUsedAt?: string;
}

export interface AccountSession {
  readonly sessionId: string;
  readonly userId: string;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly revokedAt?: string;
  readonly deviceLabel: string;
  readonly ipHash: string;
}

export interface SecurityEvent {
  readonly eventId: string;
  readonly userId: string;
  readonly type:
    | 'session_created'
    | 'session_revoked'
    | 'recovery_requested'
    | 'mfa_challenge_required'
    | 'password_changed';
  readonly occurredAt: string;
  readonly metadata: Record<string, string>;
}

export function isPrivilegedRole(role: AccountRole): boolean {
  return role === 'admin' || role === 'founder' || role === 'moderator' || role === 'support';
}

export function hasRole(account: UserAccount, role: AccountRole): boolean {
  return account.roles.includes(role);
}

export function canAccessAdminSurface(account: UserAccount): boolean {
  return hasRole(account, 'admin') || hasRole(account, 'founder');
}

export function isSessionActive(session: AccountSession, atIso: string): boolean {
  const at = Date.parse(atIso);
  const issuedAt = Date.parse(session.issuedAt);
  const expiresAt = Date.parse(session.expiresAt);

  if (session.revokedAt !== undefined) {
    return false;
  }

  return Number.isFinite(at) && at >= issuedAt && at < expiresAt;
}
