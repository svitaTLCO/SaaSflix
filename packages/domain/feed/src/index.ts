export type FeedPostState = 'draft' | 'scheduled' | 'published' | 'archived';

export type FeedPostVisibility = 'public' | 'member';

export interface FeedPost {
  readonly postId: string;
  readonly authorUserId: string;
  readonly title: string;
  readonly bodyMarkdown: string;
  readonly visibility: FeedPostVisibility;
  readonly state: FeedPostState;
  readonly createdAt: string;
  readonly scheduledFor?: string;
  readonly publishedAt?: string;
  readonly archivedAt?: string;
}

export type FeedValidationReason =
  | 'invalid_created_at'
  | 'invalid_scheduled_for'
  | 'invalid_published_at'
  | 'invalid_archived_at'
  | 'scheduled_before_created'
  | 'published_before_created'
  | 'unsafe_content';

export interface FeedValidationResult {
  readonly isValid: boolean;
  readonly reasons: readonly FeedValidationReason[];
}

const transitionGraph: Record<FeedPostState, readonly FeedPostState[]> = {
  draft: ['scheduled', 'published', 'archived'],
  scheduled: ['published', 'archived'],
  published: ['archived'],
  archived: []
};

function parseIsoTimestamp(value: string | undefined): number {
  if (value === undefined) {
    return Number.NaN;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function hasUnsafeContent(markdown: string): boolean {
  const lowered = markdown.toLowerCase();
  return lowered.includes('<script') || lowered.includes('javascript:');
}

export function validateFeedPost(post: FeedPost): FeedValidationResult {
  const reasons: FeedValidationReason[] = [];
  const createdAt = parseIsoTimestamp(post.createdAt);

  if (!Number.isFinite(createdAt)) {
    reasons.push('invalid_created_at');
  }

  if (post.scheduledFor !== undefined) {
    const scheduledFor = parseIsoTimestamp(post.scheduledFor);
    if (!Number.isFinite(scheduledFor)) {
      reasons.push('invalid_scheduled_for');
    } else if (Number.isFinite(createdAt) && scheduledFor < createdAt) {
      reasons.push('scheduled_before_created');
    }
  }

  if (post.publishedAt !== undefined) {
    const publishedAt = parseIsoTimestamp(post.publishedAt);
    if (!Number.isFinite(publishedAt)) {
      reasons.push('invalid_published_at');
    } else if (Number.isFinite(createdAt) && publishedAt < createdAt) {
      reasons.push('published_before_created');
    }
  }

  if (post.archivedAt !== undefined && !Number.isFinite(parseIsoTimestamp(post.archivedAt))) {
    reasons.push('invalid_archived_at');
  }

  if (hasUnsafeContent(post.bodyMarkdown)) {
    reasons.push('unsafe_content');
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
}

export function canTransitionFeedPostState(current: FeedPostState, next: FeedPostState): boolean {
  return current === next || transitionGraph[current].includes(next);
}

export interface FeedPostTransitionResult {
  readonly reason: 'applied' | 'invalid_transition' | 'invalid_post';
  readonly updatedPost: FeedPost | null;
}

export function applyFeedPostTransition(post: FeedPost, nextState: FeedPostState, occurredAt: string): FeedPostTransitionResult {
  if (!validateFeedPost(post).isValid || !Number.isFinite(parseIsoTimestamp(occurredAt))) {
    return {
      reason: 'invalid_post',
      updatedPost: null
    };
  }

  if (!canTransitionFeedPostState(post.state, nextState)) {
    return {
      reason: 'invalid_transition',
      updatedPost: null
    };
  }

  const updatedPost: FeedPost = {
    ...post,
    state: nextState,
    ...(nextState === 'published' ? { publishedAt: occurredAt } : {}),
    ...(nextState === 'archived' ? { archivedAt: occurredAt } : {})
  };

  return {
    reason: 'applied',
    updatedPost
  };
}

export function isFeedPostVisible(post: FeedPost, atIso: string, viewer: FeedPostVisibility): boolean {
  const now = parseIsoTimestamp(atIso);
  if (!validateFeedPost(post).isValid || !Number.isFinite(now) || post.state !== 'published' || post.publishedAt === undefined) {
    return false;
  }

  if (post.visibility === 'member' && viewer === 'public') {
    return false;
  }

  return now >= parseIsoTimestamp(post.publishedAt);
}
