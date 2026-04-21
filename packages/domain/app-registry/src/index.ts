import type { PlanCode } from '@saasflix/domain-billing';

export type AppLifecycleStatus =
  | 'concept'
  | 'in_development'
  | 'private_beta'
  | 'public_beta'
  | 'stable'
  | 'experimental'
  | 'deprecated'
  | 'archived';

export type AppVisibility = 'public' | 'member' | 'admin_only';

export type IntegrationType =
  | 'native_module'
  | 'embedded_experience'
  | 'external_web_app'
  | 'downloadable_native_app'
  | 'installable_companion'
  | 'prototype_surface';

export type AppAvailability =
  | {
      readonly kind: 'included_from_plan';
      readonly minimumPlan: PlanCode;
    }
  | {
      readonly kind: 'invite_only';
    }
  | {
      readonly kind: 'founder_circle_only';
    }
  | {
      readonly kind: 'time_limited_experiment';
      readonly startsAt: string;
      readonly endsAt: string;
    };

export interface AppRecord {
  readonly appId: string;
  readonly slug: string;
  readonly publicName: string;
  readonly shortThesis: string;
  readonly lifecycleStatus: AppLifecycleStatus;
  readonly visibility: AppVisibility;
  readonly availability: AppAvailability;
  readonly integrationType: IntegrationType;
  readonly launchUrl: string;
  readonly createdAt: string;
  readonly publishedAt?: string;
  readonly archivedAt?: string;
}

export type AppRecordValidationReason =
  | 'invalid_created_at'
  | 'invalid_published_at'
  | 'invalid_archived_at'
  | 'invalid_time_window'
  | 'unsafe_launch_url';

export interface AppRecordValidation {
  readonly isValid: boolean;
  readonly reasons: readonly AppRecordValidationReason[];
}

const planRank: Record<PlanCode, number> = {
  base: 0,
  pro: 1,
  ultra: 2
};

function parseIsoTimestamp(value: string | undefined): number {
  if (value === undefined) {
    return Number.NaN;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function isSafeLaunchUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateAppRecord(app: AppRecord): AppRecordValidation {
  const reasons: AppRecordValidationReason[] = [];
  const createdAt = parseIsoTimestamp(app.createdAt);

  if (!Number.isFinite(createdAt)) {
    reasons.push('invalid_created_at');
  }

  if (app.publishedAt !== undefined && !Number.isFinite(parseIsoTimestamp(app.publishedAt))) {
    reasons.push('invalid_published_at');
  }

  if (app.archivedAt !== undefined && !Number.isFinite(parseIsoTimestamp(app.archivedAt))) {
    reasons.push('invalid_archived_at');
  }

  if (!isSafeLaunchUrl(app.launchUrl)) {
    reasons.push('unsafe_launch_url');
  }

  if (app.availability.kind === 'time_limited_experiment') {
    const startsAt = parseIsoTimestamp(app.availability.startsAt);
    const endsAt = parseIsoTimestamp(app.availability.endsAt);

    if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || startsAt >= endsAt) {
      reasons.push('invalid_time_window');
    }
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
}

export function canAttachRelease(app: AppRecord): boolean {
  if (!validateAppRecord(app).isValid) {
    return false;
  }

  return app.lifecycleStatus !== 'concept' && app.lifecycleStatus !== 'archived';
}

export function isDiscoverableInLibrary(app: AppRecord): boolean {
  if (!validateAppRecord(app).isValid) {
    return false;
  }

  return app.lifecycleStatus !== 'concept' && app.visibility !== 'admin_only' && app.publishedAt !== undefined;
}

export function isVisibleToPublicAudience(app: AppRecord): boolean {
  if (!validateAppRecord(app).isValid) {
    return false;
  }

  if (app.visibility !== 'public' || app.publishedAt === undefined) {
    return false;
  }

  return app.lifecycleStatus !== 'concept' && app.lifecycleStatus !== 'in_development' && app.lifecycleStatus !== 'private_beta';
}

export interface MemberAccessContext {
  readonly memberPlan: PlanCode;
  readonly atIso: string;
  readonly hasInvite: boolean;
  readonly hasFounderCircleAccess: boolean;
}

export function canMemberAccessApp(app: AppRecord, context: MemberAccessContext): boolean {
  const now = parseIsoTimestamp(context.atIso);
  const validation = validateAppRecord(app);

  if (!validation.isValid || !Number.isFinite(now) || app.lifecycleStatus === 'archived') {
    return false;
  }

  switch (app.availability.kind) {
    case 'included_from_plan':
      return planRank[context.memberPlan] >= planRank[app.availability.minimumPlan];
    case 'invite_only':
      return context.hasInvite;
    case 'founder_circle_only':
      return context.hasFounderCircleAccess;
    case 'time_limited_experiment': {
      const startsAt = parseIsoTimestamp(app.availability.startsAt);
      const endsAt = parseIsoTimestamp(app.availability.endsAt);

      return Number.isFinite(startsAt) && Number.isFinite(endsAt) && now >= startsAt && now < endsAt;
    }
  }
}
