export type SearchEntityType = 'app' | 'release' | 'post' | 'discussion' | 'support_article';

export interface SearchDocument {
  readonly id: string;
  readonly entityType: SearchEntityType;
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
  readonly publishedAt?: string;
}

export interface SearchQuery {
  readonly text: string;
  readonly types?: readonly SearchEntityType[];
}

export function scoreSearchDocument(doc: SearchDocument, query: SearchQuery): number {
  const q = query.text.toLowerCase().trim();
  if (q.length === 0) return 0;

  let score = 0;
  if (doc.title.toLowerCase().includes(q)) score += 5;
  if (doc.body.toLowerCase().includes(q)) score += 2;
  if (doc.tags.some((tag) => tag.toLowerCase().includes(q))) score += 3;
  if (doc.publishedAt !== undefined && !Number.isNaN(Date.parse(doc.publishedAt))) score += 1;
  return score;
}

export function filterByType(doc: SearchDocument, query: SearchQuery): boolean {
  return query.types === undefined || query.types.includes(doc.entityType);
}
