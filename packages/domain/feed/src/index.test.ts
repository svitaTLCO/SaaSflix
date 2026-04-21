import { describe, expect, it } from 'vitest';

import {
  applyFeedPostTransition,
  canTransitionFeedPostState,
  isFeedPostVisible,
  validateFeedPost,
  type FeedPost
} from './index';

const draftPost: FeedPost = {
  postId: 'post-1',
  authorUserId: '11111111-1111-1111-1111-111111111111',
  title: 'Launch week update',
  bodyMarkdown: 'We shipped the release timeline and onboarding polish.',
  visibility: 'member',
  state: 'draft',
  createdAt: '2026-04-20T00:00:00.000Z'
};

describe('feed domain', () => {
  it('rejects unsafe content payloads', () => {
    const result = validateFeedPost({
      ...draftPost,
      bodyMarkdown: '<script>alert(1)</script>'
    });

    expect(result.isValid).toBe(false);
    expect(result.reasons).toContain('unsafe_content');
  });

  it('guards state transitions', () => {
    expect(canTransitionFeedPostState('draft', 'published')).toBe(true);
    expect(canTransitionFeedPostState('archived', 'draft')).toBe(false);
  });

  it('publishes posts with timestamp updates', () => {
    const transition = applyFeedPostTransition(draftPost, 'published', '2026-04-21T00:00:00.000Z');
    expect(transition.reason).toBe('applied');
    expect(transition.updatedPost?.state).toBe('published');
    expect(transition.updatedPost?.publishedAt).toBe('2026-04-21T00:00:00.000Z');
  });

  it('returns invalid_post when occurredAt is malformed', () => {
    const transition = applyFeedPostTransition(draftPost, 'published', 'not-a-date');
    expect(transition.reason).toBe('invalid_post');
  });

  it('enforces visibility boundaries for member-only posts', () => {
    const publishedPost: FeedPost = {
      ...draftPost,
      state: 'published',
      publishedAt: '2026-04-21T00:00:00.000Z'
    };

    expect(isFeedPostVisible(publishedPost, '2026-04-21T00:10:00.000Z', 'member')).toBe(true);
    expect(isFeedPostVisible(publishedPost, '2026-04-21T00:10:00.000Z', 'public')).toBe(false);
  });
});
