import { describe, expect, it } from 'vitest';

import {
  applyPublicationTransition,
  canTransitionPublicationState,
  isReleaseVisible,
  validateRelease,
  type AppRelease
} from './index';

const draftRelease: AppRelease = {
  releaseId: 'rel-1',
  appId: 'app-core-notes',
  versionLabel: 'v1.0.0',
  summary: 'Initial launch release.',
  releaseNotesMarkdown: '## Launch\nShipped core notes app.',
  releaseType: 'launch',
  publicationState: 'draft',
  createdAt: '2026-04-01T00:00:00.000Z'
};

describe('release domain', () => {
  it('allows valid state transitions and rejects invalid ones', () => {
    expect(canTransitionPublicationState('draft', 'scheduled')).toBe(true);
    expect(canTransitionPublicationState('withdrawn', 'draft')).toBe(false);
  });

  it('rejects malformed timestamps and temporal regressions', () => {
    const invalidRelease: AppRelease = {
      ...draftRelease,
      createdAt: 'invalid-date',
      publishedAt: '2026-03-01T00:00:00.000Z'
    };

    const validation = validateRelease(invalidRelease);
    expect(validation.isValid).toBe(false);
    expect(validation.reasons).toContain('invalid_created_at');
  });

  it('returns invalid_release when transition payload timestamp is malformed', () => {
    const result = applyPublicationTransition(draftRelease, 'published', 'not-a-date');
    expect(result.reason).toBe('invalid_release');
    expect(result.updatedRelease).toBeNull();
  });

  it('transitions release to published with timestamps', () => {
    const result = applyPublicationTransition(draftRelease, 'published', '2026-04-21T00:00:00.000Z');
    expect(result.reason).toBe('applied');
    expect(result.updatedRelease?.publicationState).toBe('published');
    expect(result.updatedRelease?.publishedAt).toBe('2026-04-21T00:00:00.000Z');
  });

  it('shows published releases after publication time only', () => {
    const publishedRelease: AppRelease = {
      ...draftRelease,
      publicationState: 'published',
      publishedAt: '2026-04-21T00:00:00.000Z'
    };

    expect(isReleaseVisible(publishedRelease, '2026-04-20T23:59:00.000Z')).toBe(false);
    expect(isReleaseVisible(publishedRelease, '2026-04-21T00:00:01.000Z')).toBe(true);
  });

  it('rejects invalid transitions from published to draft', () => {
    const result = applyPublicationTransition(
      {
        ...draftRelease,
        publicationState: 'published',
        publishedAt: '2026-04-21T00:00:00.000Z'
      },
      'draft',
      '2026-04-22T00:00:00.000Z'
    );

    expect(result.reason).toBe('invalid_transition');
    expect(result.updatedRelease).toBeNull();
  });
});
