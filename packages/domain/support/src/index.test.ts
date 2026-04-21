import { describe, expect, it } from 'vitest';

import {
  applySupportCaseTransition,
  canPromoteToKnowledgeCandidate,
  canTransitionSupportCase,
  canViewSupportCase,
  type SupportCase,
  validateSupportCase
} from './index';

const baseCase: SupportCase = {
  caseId: 'case-1',
  requesterUserId: '11111111-1111-1111-1111-111111111111',
  appId: 'app-core-notes',
  subject: 'Can\'t export notes',
  bodyMarkdown: 'Export fails after clicking download.',
  visibility: 'member_private',
  state: 'open',
  createdAt: '2026-04-21T00:00:00.000Z'
};

describe('support domain', () => {
  it('rejects unsafe case content', () => {
    const result = validateSupportCase({ ...baseCase, bodyMarkdown: '<script>alert(1)</script>' });
    expect(result.isValid).toBe(false);
    expect(result.reasons).toContain('unsafe_content');
  });

  it('guards invalid transitions', () => {
    expect(canTransitionSupportCase('closed', 'open')).toBe(false);
  });

  it('applies valid transitions', () => {
    const result = applySupportCaseTransition(baseCase, 'resolved', '2026-04-22T00:00:00.000Z');
    expect(result.reason).toBe('applied');
    expect(result.updatedCase?.state).toBe('resolved');
  });

  it('enforces support visibility', () => {
    expect(canViewSupportCase(baseCase, { userId: baseCase.requesterUserId, isStaff: false })).toBe(true);
    expect(canViewSupportCase(baseCase, { userId: 'other', isStaff: false })).toBe(false);
  });

  it('marks answered cases as knowledge candidates', () => {
    expect(canPromoteToKnowledgeCandidate({ ...baseCase, state: 'answered' })).toBe(true);
  });
});
