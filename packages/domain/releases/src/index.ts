export type ReleaseType =
  | 'launch'
  | 'major_update'
  | 'minor_update'
  | 'beta_drop'
  | 'experimental_drop'
  | 'deprecation_notice'
  | 'archive_notice';

export type ReleasePublicationState = 'draft' | 'scheduled' | 'published' | 'withdrawn';

export interface AppRelease {
  readonly releaseId: string;
  readonly appId: string;
  readonly versionLabel: string;
  readonly summary: string;
  readonly releaseNotesMarkdown: string;
  readonly releaseType: ReleaseType;
  readonly publicationState: ReleasePublicationState;
  readonly createdAt: string;
  readonly scheduledFor?: string;
  readonly publishedAt?: string;
  readonly withdrawnAt?: string;
}

export type ReleaseValidationReason =
  | 'invalid_created_at'
  | 'invalid_scheduled_for'
  | 'invalid_published_at'
  | 'invalid_withdrawn_at'
  | 'scheduled_before_created'
  | 'published_before_created';

export interface ReleaseValidation {
  readonly isValid: boolean;
  readonly reasons: readonly ReleaseValidationReason[];
}

const transitionGraph: Record<ReleasePublicationState, readonly ReleasePublicationState[]> = {
  draft: ['scheduled', 'published', 'withdrawn'],
  scheduled: ['published', 'withdrawn'],
  published: ['withdrawn'],
  withdrawn: []
};

function parseIsoTimestamp(value: string | undefined): number {
  if (value === undefined) {
    return Number.NaN;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function validateRelease(release: AppRelease): ReleaseValidation {
  const reasons: ReleaseValidationReason[] = [];
  const createdAt = parseIsoTimestamp(release.createdAt);

  if (!Number.isFinite(createdAt)) {
    reasons.push('invalid_created_at');
  }

  if (release.scheduledFor !== undefined) {
    const scheduledFor = parseIsoTimestamp(release.scheduledFor);
    if (!Number.isFinite(scheduledFor)) {
      reasons.push('invalid_scheduled_for');
    } else if (Number.isFinite(createdAt) && scheduledFor < createdAt) {
      reasons.push('scheduled_before_created');
    }
  }

  if (release.publishedAt !== undefined) {
    const publishedAt = parseIsoTimestamp(release.publishedAt);
    if (!Number.isFinite(publishedAt)) {
      reasons.push('invalid_published_at');
    } else if (Number.isFinite(createdAt) && publishedAt < createdAt) {
      reasons.push('published_before_created');
    }
  }

  if (release.withdrawnAt !== undefined && !Number.isFinite(parseIsoTimestamp(release.withdrawnAt))) {
    reasons.push('invalid_withdrawn_at');
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
}

export function canTransitionPublicationState(
  current: ReleasePublicationState,
  next: ReleasePublicationState
): boolean {
  return current === next || transitionGraph[current].includes(next);
}

export function isReleaseVisible(release: AppRelease, atIso: string): boolean {
  const now = parseIsoTimestamp(atIso);
  if (!Number.isFinite(now) || !validateRelease(release).isValid) {
    return false;
  }

  if (release.publicationState === 'published') {
    if (release.publishedAt === undefined) {
      return false;
    }

    return now >= parseIsoTimestamp(release.publishedAt);
  }

  return false;
}

export interface ReleaseTransitionResult {
  readonly reason: 'applied' | 'invalid_transition' | 'invalid_release';
  readonly updatedRelease: AppRelease | null;
}

export function applyPublicationTransition(
  release: AppRelease,
  nextState: ReleasePublicationState,
  occurredAt: string
): ReleaseTransitionResult {
  if (!validateRelease(release).isValid) {
    return {
      reason: 'invalid_release',
      updatedRelease: null
    };
  }

  if (!canTransitionPublicationState(release.publicationState, nextState)) {
    return {
      reason: 'invalid_transition',
      updatedRelease: null
    };
  }

  if (!Number.isFinite(parseIsoTimestamp(occurredAt))) {
    return {
      reason: 'invalid_release',
      updatedRelease: null
    };
  }

  const updatedRelease: AppRelease = {
    ...release,
    publicationState: nextState,
    ...(nextState === 'published' ? { publishedAt: occurredAt } : {}),
    ...(nextState === 'withdrawn' ? { withdrawnAt: occurredAt } : {})
  };

  return {
    reason: 'applied',
    updatedRelease
  };
}
