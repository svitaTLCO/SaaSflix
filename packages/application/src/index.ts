import type { DomainEvent, ProviderWebhookReceipt } from '@saasflix/contracts';
import { applyPublicationTransition, type AppRelease, validateRelease } from '@saasflix/domain-releases';
import type { Subscription } from '@saasflix/domain-billing';
import type { EntitlementGrant } from '@saasflix/domain-entitlements';
import type { AccountSession, SecurityEvent, UserAccount } from '@saasflix/domain-identity';
import { validateAppRecord, type AppRecord } from '@saasflix/domain-app-registry';
import { authorizeAction } from '@saasflix/security';

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

export interface AppRegistryRepository {
  upsert(app: AppRecord): Promise<void>;
}

export interface ReleaseRepository {
  findById(releaseId: string): Promise<AppRelease | null>;
  save(release: AppRelease): Promise<void>;
}

export interface PrivilegedActionInboxRepository {
  hasProcessed(actionId: string): Promise<boolean>;
  markProcessed(actionId: string, processedAt: string): Promise<void>;
}

export interface UpsertAppRecordInput {
  readonly actionId: string;
  readonly actor: UserAccount | null;
  readonly app: AppRecord;
  readonly nowIso: string;
  readonly stepUpVerified: boolean;
}

export interface UpsertAppRecordResult {
  readonly reason: 'stored' | 'unauthorized' | 'invalid_app' | 'duplicate_request' | 'step_up_required';
}

export async function upsertAppRecord(
  input: UpsertAppRecordInput,
  repository: AppRegistryRepository,
  audit: AuditLogSink,
  actionInbox: PrivilegedActionInboxRepository,
  identityPolicy: IdentityPolicyService
): Promise<UpsertAppRecordResult> {
  if (!authorizeAction({ actor: input.actor }, 'registry.write') || input.actor === null) {
    return { reason: 'unauthorized' };
  }

  if (await actionInbox.hasProcessed(input.actionId)) {
    return { reason: 'duplicate_request' };
  }

  if (identityPolicy.shouldRequireStepUpAuth(input.actor, 'admin_publish') && !input.stepUpVerified) {
    return { reason: 'step_up_required' };
  }

  if (!validateAppRecord(input.app).isValid) {
    return { reason: 'invalid_app' };
  }

  await repository.upsert(input.app);
  await actionInbox.markProcessed(input.actionId, input.nowIso);

  await audit.appendSecurityEvent({
    eventId: input.actionId,
    userId: input.actor.userId,
    type: 'privileged_action',
    occurredAt: input.nowIso,
    metadata: {
      action: 'registry.write',
      appId: input.app.appId
    }
  });

  return { reason: 'stored' };
}

export interface PublishReleaseInput {
  readonly actionId: string;
  readonly actor: UserAccount | null;
  readonly releaseId: string;
  readonly occurredAt: string;
  readonly stepUpVerified: boolean;
}

export interface PublishReleaseResult {
  readonly reason:
    | 'published'
    | 'unauthorized'
    | 'not_found'
    | 'invalid_release'
    | 'transition_failed'
    | 'duplicate_request'
    | 'step_up_required';
  readonly updatedRelease: AppRelease | null;
}

export async function publishRelease(
  input: PublishReleaseInput,
  repository: ReleaseRepository,
  audit: AuditLogSink,
  actionInbox: PrivilegedActionInboxRepository,
  identityPolicy: IdentityPolicyService
): Promise<PublishReleaseResult> {
  if (!authorizeAction({ actor: input.actor }, 'release.publish') || input.actor === null) {
    return { reason: 'unauthorized', updatedRelease: null };
  }

  if (await actionInbox.hasProcessed(input.actionId)) {
    return { reason: 'duplicate_request', updatedRelease: null };
  }

  if (identityPolicy.shouldRequireStepUpAuth(input.actor, 'admin_publish') && !input.stepUpVerified) {
    return { reason: 'step_up_required', updatedRelease: null };
  }

  const current = await repository.findById(input.releaseId);
  if (current === null) {
    return { reason: 'not_found', updatedRelease: null };
  }

  if (!validateRelease(current).isValid) {
    return { reason: 'invalid_release', updatedRelease: null };
  }

  const transition = applyPublicationTransition(current, 'published', input.occurredAt);
  if (transition.reason !== 'applied' || transition.updatedRelease === null) {
    return {
      reason: transition.reason === 'invalid_release' ? 'invalid_release' : 'transition_failed',
      updatedRelease: null
    };
  }

  await repository.save(transition.updatedRelease);
  await actionInbox.markProcessed(input.actionId, input.occurredAt);

  await audit.appendSecurityEvent({
    eventId: input.actionId,
    userId: input.actor.userId,
    type: 'privileged_action',
    occurredAt: input.occurredAt,
    metadata: {
      action: 'release.publish',
      releaseId: input.releaseId
    }
  });

  return {
    reason: 'published',
    updatedRelease: transition.updatedRelease
  };
}
