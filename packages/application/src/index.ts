import type { DomainEvent } from '@saasflix/contracts';
import type { AccountSession, SecurityEvent, UserAccount } from '@saasflix/domain-identity';

export interface DomainEventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export interface AuditLogSink {
  appendSecurityEvent(event: SecurityEvent): Promise<void>;
}

export interface SessionRepository {
  create(session: AccountSession): Promise<void>;
  revokeById(sessionId: string, revokedAt: string): Promise<void>;
  listByUser(userId: string): Promise<readonly AccountSession[]>;
}

export interface IdentityPolicyService {
  shouldRequireStepUpAuth(account: UserAccount, action: 'billing_update' | 'session_revoke' | 'admin_publish'): boolean;
}
