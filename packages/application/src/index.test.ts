import { describe, expect, it } from 'vitest';

import type { AppRecord } from '@saasflix/domain-app-registry';
import type { AppRelease } from '@saasflix/domain-releases';
import type { SecurityEvent, UserAccount } from '@saasflix/domain-identity';

import {
  publishRelease,
  upsertAppRecord,
  type AppRegistryRepository,
  type AuditLogSink,
  type IdentityPolicyService,
  type PrivilegedActionInboxRepository,
  type ReleaseRepository
} from './index';

const founderActor: UserAccount = {
  userId: '11111111-1111-1111-1111-111111111111',
  email: 'founder@saasflix.local',
  roles: ['founder'],
  plan: 'ultra',
  mfaEnabled: true
};

const appRecord: AppRecord = {
  appId: 'app-core-notes',
  slug: 'core-notes',
  publicName: 'Core Notes',
  shortThesis: 'Capture creator workflows.',
  lifecycleStatus: 'stable',
  visibility: 'public',
  availability: {
    kind: 'included_from_plan',
    minimumPlan: 'base'
  },
  integrationType: 'external_web_app',
  launchUrl: 'https://apps.saasflix.local/core-notes',
  createdAt: '2026-01-01T00:00:00.000Z',
  publishedAt: '2026-01-15T00:00:00.000Z'
};

const draftRelease: AppRelease = {
  releaseId: 'release-1',
  appId: appRecord.appId,
  versionLabel: 'v1.0.0',
  summary: 'Initial launch release.',
  releaseNotesMarkdown: '## Launch\nShipped core notes app.',
  releaseType: 'launch',
  publicationState: 'draft',
  createdAt: '2026-04-01T00:00:00.000Z'
};

class InMemoryAuditLog implements AuditLogSink {
  public events: SecurityEvent[] = [];

  appendSecurityEvent(event: SecurityEvent): Promise<void> {
    this.events.push(event);
    return Promise.resolve();
  }
}

class InMemoryActionInbox implements PrivilegedActionInboxRepository {
  public processed = new Set<string>();

  hasProcessed(actionId: string): Promise<boolean> {
    return Promise.resolve(this.processed.has(actionId));
  }

  markProcessed(actionId: string, processedAt: string): Promise<void> {
    void processedAt;
    this.processed.add(actionId);
    return Promise.resolve();
  }
}

class DefaultPolicyService implements IdentityPolicyService {
  constructor(private requireStepUp = true) {}

  shouldRequireStepUpAuth(_account: UserAccount, _action: "billing_update" | "session_revoke" | "admin_publish"): boolean {
    void _account;
    void _action;
    return this.requireStepUp;
  }
}

class InMemoryAppRegistryRepository implements AppRegistryRepository {
  public stored: AppRecord[] = [];

  upsert(app: AppRecord): Promise<void> {
    this.stored.push(app);
    return Promise.resolve();
  }
}

class InMemoryReleaseRepository implements ReleaseRepository {
  public constructor(private release: AppRelease | null) {}

  findById(releaseId: string): Promise<AppRelease | null> {
    void releaseId;
    return Promise.resolve(this.release);
  }

  save(release: AppRelease): Promise<void> {
    this.release = release;
    return Promise.resolve();
  }
}

describe('application secure orchestration', () => {
  it('upserts app records for privileged actors and emits audit events', async () => {
    const audit = new InMemoryAuditLog();
    const repository = new InMemoryAppRegistryRepository();
    const actionInbox = new InMemoryActionInbox();

    const result = await upsertAppRecord(
      {
        actionId: 'action-upsert-1',
        actor: founderActor,
        app: appRecord,
        nowIso: '2026-04-21T00:00:00.000Z',
        stepUpVerified: true
      },
      repository,
      audit,
      actionInbox,
      new DefaultPolicyService()
    );

    expect(result.reason).toBe('stored');
    expect(repository.stored).toHaveLength(1);
    expect(audit.events[0]?.type).toBe('privileged_action');
    expect(audit.events[0]?.metadata.action).toBe('registry.write');
  });

  it('blocks duplicate app registry writes by action id', async () => {
    const audit = new InMemoryAuditLog();
    const repository = new InMemoryAppRegistryRepository();
    const actionInbox = new InMemoryActionInbox();
    actionInbox.processed.add('action-upsert-1');

    const result = await upsertAppRecord(
      {
        actionId: 'action-upsert-1',
        actor: founderActor,
        app: appRecord,
        nowIso: '2026-04-21T00:00:00.000Z',
        stepUpVerified: true
      },
      repository,
      audit,
      actionInbox,
      new DefaultPolicyService()
    );

    expect(result.reason).toBe('duplicate_request');
    expect(repository.stored).toHaveLength(0);
  });

  it('requires step-up auth when policy demands it', async () => {
    const audit = new InMemoryAuditLog();
    const repository = new InMemoryAppRegistryRepository();
    const actionInbox = new InMemoryActionInbox();

    const result = await upsertAppRecord(
      {
        actionId: 'action-upsert-2',
        actor: founderActor,
        app: appRecord,
        nowIso: '2026-04-21T00:00:00.000Z',
        stepUpVerified: false
      },
      repository,
      audit,
      actionInbox,
      new DefaultPolicyService(true)
    );

    expect(result.reason).toBe('step_up_required');
  });

  it('publishes a draft release for authorized actors', async () => {
    const audit = new InMemoryAuditLog();
    const repository = new InMemoryReleaseRepository(draftRelease);
    const actionInbox = new InMemoryActionInbox();

    const result = await publishRelease(
      {
        actionId: 'action-release-1',
        actor: founderActor,
        releaseId: draftRelease.releaseId,
        occurredAt: '2026-04-21T00:00:00.000Z',
        stepUpVerified: true
      },
      repository,
      audit,
      actionInbox,
      new DefaultPolicyService()
    );

    expect(result.reason).toBe('published');
    expect(result.updatedRelease?.publicationState).toBe('published');
    expect(audit.events[0]?.metadata.action).toBe('release.publish');
  });

  it('fails publish transitions with invalid timestamps', async () => {
    const audit = new InMemoryAuditLog();
    const repository = new InMemoryReleaseRepository(draftRelease);
    const actionInbox = new InMemoryActionInbox();

    const result = await publishRelease(
      {
        actionId: 'action-release-2',
        actor: founderActor,
        releaseId: draftRelease.releaseId,
        occurredAt: 'invalid-date',
        stepUpVerified: true
      },
      repository,
      audit,
      actionInbox,
      new DefaultPolicyService()
    );

    expect(result.reason).toBe('invalid_release');
    expect(result.updatedRelease).toBeNull();
  });
});
