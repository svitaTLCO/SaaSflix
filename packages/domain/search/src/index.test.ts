import { describe, expect, it } from 'vitest';
import { filterByType, scoreSearchDocument, type SearchDocument } from './index';

const doc: SearchDocument = {
  id: 'doc-1',
  entityType: 'post',
  title: 'Launch recap',
  body: 'Recap of release milestones and roadmap updates',
  tags: ['release', 'roadmap'],
  publishedAt: '2026-04-21T00:00:00.000Z'
};

describe('search domain', () => {
  it('scores relevant docs higher than zero', () => {
    expect(scoreSearchDocument(doc, { text: 'release' })).toBeGreaterThan(0);
  });

  it('filters by requested result type', () => {
    expect(filterByType(doc, { text: 'launch', types: ['post'] })).toBe(true);
    expect(filterByType(doc, { text: 'launch', types: ['app'] })).toBe(false);
  });
});
