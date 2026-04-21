import type { DomainEvent, ProviderWebhookReceipt } from '@saasflix/contracts';
import type { Subscription } from '@saasflix/domain-billing';
import type { EntitlementGrant } from '@saasflix/domain-entitlements';
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

export interface BillingWebhookInboxRepository {
  hasProcessed(providerEventId: string): Promise<boolean>;
  markProcessed(receipt: ProviderWebhookReceipt): Promise<void>;
}

export interface SubscriptionRepository {
  save(subscription: Subscription): Promise<void>;
  findById(subscriptionId: string): Promise<Subscription | null>;
}

export interface EntitlementRepository {
  replaceForUser(userId: string, grants: readonly EntitlementGrant[]): Promise<void>;
}
