export type SupportCaseState = 'open' | 'under_review' | 'waiting_customer' | 'answered' | 'escalated' | 'resolved' | 'closed';
export type SupportVisibility = 'staff_private' | 'member_private' | 'member_shared';

export interface SupportCase {
  readonly caseId: string;
  readonly requesterUserId: string;
  readonly appId?: string;
  readonly releaseId?: string;
  readonly subject: string;
  readonly bodyMarkdown: string;
  readonly visibility: SupportVisibility;
  readonly state: SupportCaseState;
  readonly createdAt: string;
  readonly resolvedAt?: string;
  readonly acceptedAnswerCommentId?: string;
}

export interface SupportViewerContext {
  readonly userId: string | null;
  readonly isStaff: boolean;
}

export type SupportValidationReason = 'missing_subject' | 'missing_body' | 'invalid_created_at' | 'unsafe_content';

const transitionGraph: Record<SupportCaseState, readonly SupportCaseState[]> = {
  open: ['under_review', 'answered', 'escalated', 'resolved', 'closed'],
  under_review: ['answered', 'waiting_customer', 'escalated', 'resolved', 'closed'],
  waiting_customer: ['under_review', 'answered', 'resolved', 'closed'],
  answered: ['waiting_customer', 'resolved', 'closed'],
  escalated: ['under_review', 'answered', 'resolved', 'closed'],
  resolved: ['closed'],
  closed: []
};

function hasUnsafeContent(markdown: string): boolean {
  const lowered = markdown.toLowerCase();
  return lowered.includes('<script') || lowered.includes('javascript:');
}

export function validateSupportCase(input: SupportCase): { readonly isValid: boolean; readonly reasons: readonly SupportValidationReason[] } {
  const reasons: SupportValidationReason[] = [];

  if (input.subject.trim().length === 0) {
    reasons.push('missing_subject');
  }
  if (input.bodyMarkdown.trim().length === 0) {
    reasons.push('missing_body');
  }
  if (Number.isNaN(Date.parse(input.createdAt))) {
    reasons.push('invalid_created_at');
  }
  if (hasUnsafeContent(`${input.subject}\n${input.bodyMarkdown}`)) {
    reasons.push('unsafe_content');
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
}

export function canTransitionSupportCase(from: SupportCaseState, to: SupportCaseState): boolean {
  return from === to || transitionGraph[from].includes(to);
}

export function applySupportCaseTransition(
  current: SupportCase,
  nextState: SupportCaseState,
  occurredAt: string
): { readonly reason: 'applied' | 'invalid_case' | 'invalid_transition' | 'invalid_timestamp'; readonly updatedCase: SupportCase | null } {
  if (!validateSupportCase(current).isValid) {
    return { reason: 'invalid_case', updatedCase: null };
  }
  if (!canTransitionSupportCase(current.state, nextState)) {
    return { reason: 'invalid_transition', updatedCase: null };
  }
  if (Number.isNaN(Date.parse(occurredAt))) {
    return { reason: 'invalid_timestamp', updatedCase: null };
  }

  return {
    reason: 'applied',
    updatedCase: {
      ...current,
      state: nextState,
      ...(nextState === 'resolved' || nextState === 'closed' ? { resolvedAt: occurredAt } : {})
    }
  };
}

export function canViewSupportCase(supportCase: SupportCase, viewer: SupportViewerContext): boolean {
  if (viewer.isStaff) {
    return true;
  }
  if (viewer.userId === null) {
    return false;
  }

  if (supportCase.visibility === 'staff_private') {
    return false;
  }

  return supportCase.requesterUserId === viewer.userId || supportCase.visibility === 'member_shared';
}

export function canPromoteToKnowledgeCandidate(supportCase: SupportCase): boolean {
  return supportCase.state === 'answered' || supportCase.state === 'resolved' || supportCase.acceptedAnswerCommentId !== undefined;
}
