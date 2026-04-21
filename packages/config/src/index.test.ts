import { describe, expect, it } from 'vitest';

import { parseEnv } from './index';

describe('parseEnv', () => {
  it('parses known-good env values', () => {
    const parsed = parseEnv({
      DATABASE_URL: 'https://database.local',
      REDIS_URL: 'https://redis.local',
      S3_ENDPOINT: 'https://s3.local',
      BILLING_WEBHOOK_SECRET: 'secret',
      MEILISEARCH_URL: 'https://search.local',
      MEILISEARCH_API_KEY: 'key'
    });

    expect(parsed.BILLING_PROVIDER).toBe('stripe');
    expect(parsed.SEARCH_PROVIDER).toBe('meilisearch');
  });
});
