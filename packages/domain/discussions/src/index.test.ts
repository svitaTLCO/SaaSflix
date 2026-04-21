import { describe, expect, it } from 'vitest';

import {
  applyModerationTransition,
  canTransitionModerationState,
  canViewDiscussionThread,
  validateDiscussionThread,
  type DiscussionThread
} from './index';

const baseThread: DiscussionThread = {
  threadId: 'thread-1',
  threadType: 'release_discussion',
  title: 'Release v1.0 feedback',
  bodyMarkdown: 'Share regressions and wins.',
  authorUserId: '11111111-1111-1111-1111-111111111111',
  visibility: 'member',
  moderationState: 'open',
  createdAt: '2026-04-21T00:00:00.000Z'
};

describe('discussions domain', () => {
  it('rejects unsafe content', () => {
    const validation = validateDiscussionThread({
      ...baseThread,
      bodyMarkdown: '<script>alert(1)</script>'
    });

    expect(validation.isValid).toBe(false);
    expect(validation.reasons).toContain('unsafe_content');
  });

  it('guards moderation transitions', () => {
    expect(canTransitionModerationState('open', 'locked')).toBe(true);
    expect(canTransitionModerationState('archived', 'open')).toBe(false);
  });

  it('applies moderation transitions when valid', () => {
    const result = applyModerationTransition(baseThread, 'locked');
    expect(result.reason).toBe('applied');
    expect(result.updatedThread?.moderationState).toBe('locked');
  });

  it('enforces app-member visibility checks', () => {
    const appThread: DiscussionThread = {
      ...baseThread,
      visibility: 'app_member'
    };

    expect(
      canViewDiscussionThread(appThread, {
        isAuthenticated: true,
        isStaff: false,
        hasFounderCircleAccess: false,
        hasAppAccess: true
      })
    ).toBe(true);

    expect(
      canViewDiscussionThread(appThread, {
        isAuthenticated: true,
        isStaff: false,
        hasFounderCircleAccess: false,
        hasAppAccess: false
      })
    ).toBe(false);
  });

  it('hides archived threads from non-staff viewers', () => {
    const archivedThread: DiscussionThread = {
      ...baseThread,
      moderationState: 'archived'
    };

    expect(
      canViewDiscussionThread(archivedThread, {
        isAuthenticated: true,
        isStaff: false,
        hasFounderCircleAccess: false,
        hasAppAccess: true
      })
    ).toBe(false);
  });
});
