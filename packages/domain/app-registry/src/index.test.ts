import { describe, expect, it } from 'vitest';

import {
  canAttachRelease,
  canMemberAccessApp,
  isDiscoverableInLibrary,
  isVisibleToPublicAudience,
  validateAppRecord,
  type AppRecord
} from './index';

const baseApp: AppRecord = {
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

describe('app registry domain', () => {
  it('marks stable published apps as discoverable and public-visible', () => {
    expect(isDiscoverableInLibrary(baseApp)).toBe(true);
    expect(isVisibleToPublicAudience(baseApp)).toBe(true);
  });

  it('rejects unsafe launch URLs and malformed dates', () => {
    const validation = validateAppRecord({
      ...baseApp,
      launchUrl: 'javascript:alert(1)',
      createdAt: 'not-a-date'
    });

    expect(validation.isValid).toBe(false);
    expect(validation.reasons).toContain('unsafe_launch_url');
    expect(validation.reasons).toContain('invalid_created_at');
  });

  it('rejects malformed experiment windows', () => {
    const invalidWindow = {
      ...baseApp,
      availability: {
        kind: 'time_limited_experiment' as const,
        startsAt: '2026-06-01T00:00:00.000Z',
        endsAt: '2026-05-01T00:00:00.000Z'
      }
    };

    expect(validateAppRecord(invalidWindow).isValid).toBe(false);
    expect(
      canMemberAccessApp(invalidWindow, {
        memberPlan: 'ultra',
        atIso: '2026-05-15T00:00:00.000Z',
        hasInvite: false,
        hasFounderCircleAccess: false
      })
    ).toBe(false);
  });

  it('blocks release attachments for concept apps', () => {
    expect(canAttachRelease({ ...baseApp, lifecycleStatus: 'concept' })).toBe(false);
  });

  it('respects minimum plan thresholds for included apps', () => {
    expect(
      canMemberAccessApp(
        {
          ...baseApp,
          availability: { kind: 'included_from_plan', minimumPlan: 'pro' }
        },
        {
          memberPlan: 'base',
          atIso: '2026-04-21T00:00:00.000Z',
          hasInvite: false,
          hasFounderCircleAccess: false
        }
      )
    ).toBe(false);

    expect(
      canMemberAccessApp(
        {
          ...baseApp,
          availability: { kind: 'included_from_plan', minimumPlan: 'pro' }
        },
        {
          memberPlan: 'ultra',
          atIso: '2026-04-21T00:00:00.000Z',
          hasInvite: false,
          hasFounderCircleAccess: false
        }
      )
    ).toBe(true);
  });

  it('grants access to time-limited experiments only while the window is active', () => {
    const experimentApp: AppRecord = {
      ...baseApp,
      availability: {
        kind: 'time_limited_experiment',
        startsAt: '2026-04-01T00:00:00.000Z',
        endsAt: '2026-05-01T00:00:00.000Z'
      }
    };

    expect(
      canMemberAccessApp(experimentApp, {
        memberPlan: 'base',
        atIso: '2026-04-21T00:00:00.000Z',
        hasInvite: false,
        hasFounderCircleAccess: false
      })
    ).toBe(true);

    expect(
      canMemberAccessApp(experimentApp, {
        memberPlan: 'base',
        atIso: '2026-05-02T00:00:00.000Z',
        hasInvite: false,
        hasFounderCircleAccess: false
      })
    ).toBe(false);
  });
});
