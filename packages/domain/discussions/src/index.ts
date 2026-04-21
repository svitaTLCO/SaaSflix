export type DiscussionThreadType =
  | 'release_discussion'
  | 'product_feedback'
  | 'support_question'
  | 'roadmap_discussion'
  | 'founder_post_discussion'
  | 'announcement_thread'
  | 'known_issue_thread';

export type DiscussionVisibility = 'public' | 'member' | 'app_member' | 'staff_private' | 'founder_circle';

export type ModerationState = 'open' | 'locked' | 'hidden' | 'archived';

export interface DiscussionThread {
  readonly threadId: string;
  readonly threadType: DiscussionThreadType;
  readonly title: string;
  readonly bodyMarkdown: string;
  readonly authorUserId: string;
  readonly visibility: DiscussionVisibility;
  readonly moderationState: ModerationState;
  readonly createdAt: string;
  readonly appId?: string;
  readonly releaseId?: string;
  readonly founderPostId?: string;
  readonly supportCaseId?: string;
}

export interface DiscussionViewerContext {
  readonly isAuthenticated: boolean;
  readonly isStaff: boolean;
  readonly hasFounderCircleAccess: boolean;
  readonly hasAppAccess: boolean;
}

export type DiscussionValidationReason = 'invalid_created_at' | 'unsafe_content' | 'missing_title' | 'missing_body';

export interface DiscussionValidationResult {
  readonly isValid: boolean;
  readonly reasons: readonly DiscussionValidationReason[];
}

const moderationGraph: Record<ModerationState, readonly ModerationState[]> = {
  open: ['locked', 'hidden', 'archived'],
  locked: ['open', 'hidden', 'archived'],
  hidden: ['open', 'archived'],
  archived: []
};

function hasUnsafeContent(markdown: string): boolean {
  const lowered = markdown.toLowerCase();
  return lowered.includes('<script') || lowered.includes('javascript:');
}

export function validateDiscussionThread(thread: DiscussionThread): DiscussionValidationResult {
  const reasons: DiscussionValidationReason[] = [];

  if (thread.title.trim().length === 0) {
    reasons.push('missing_title');
  }

  if (thread.bodyMarkdown.trim().length === 0) {
    reasons.push('missing_body');
  }

  if (Number.isNaN(Date.parse(thread.createdAt))) {
    reasons.push('invalid_created_at');
  }

  if (hasUnsafeContent(`${thread.title}\n${thread.bodyMarkdown}`)) {
    reasons.push('unsafe_content');
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
}

export function canTransitionModerationState(from: ModerationState, to: ModerationState): boolean {
  return from === to || moderationGraph[from].includes(to);
}

export function applyModerationTransition(
  thread: DiscussionThread,
  nextState: ModerationState
): { readonly reason: 'applied' | 'invalid_thread' | 'invalid_transition'; readonly updatedThread: DiscussionThread | null } {
  if (!validateDiscussionThread(thread).isValid) {
    return { reason: 'invalid_thread', updatedThread: null };
  }

  if (!canTransitionModerationState(thread.moderationState, nextState)) {
    return { reason: 'invalid_transition', updatedThread: null };
  }

  return {
    reason: 'applied',
    updatedThread: {
      ...thread,
      moderationState: nextState
    }
  };
}

export function canViewDiscussionThread(thread: DiscussionThread, viewer: DiscussionViewerContext): boolean {
  if (thread.moderationState === 'hidden' || thread.moderationState === 'archived') {
    return viewer.isStaff;
  }

  switch (thread.visibility) {
    case 'public':
      return true;
    case 'member':
      return viewer.isAuthenticated;
    case 'app_member':
      return viewer.isAuthenticated && viewer.hasAppAccess;
    case 'staff_private':
      return viewer.isStaff;
    case 'founder_circle':
      return viewer.isAuthenticated && viewer.hasFounderCircleAccess;
  }
}
