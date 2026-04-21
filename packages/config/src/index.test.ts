import { describe, expect, it } from 'vitest';

import { parseEnv, parseStagingEnv } from './index';

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
    expect(parsed.APP_ENV).toBe('local');
  });

  it('enforces staging env requirements', () => {
    const parsed = parseStagingEnv({
      NODE_ENV: 'production',
      APP_ENV: 'staging',
      DATABASE_URL: 'https://database.local',
      REDIS_URL: 'https://redis.local',
      S3_ENDPOINT: 'https://s3.local',
      BILLING_WEBHOOK_SECRET: 'secret',
      MEILISEARCH_URL: 'https://search.local',
      MEILISEARCH_API_KEY: 'key',
      WEB_BASE_URL: 'https://staging-web.saasflix.local',
      ADMIN_BASE_URL: 'https://staging-admin.saasflix.local',
      OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otel.local'
    });

    expect(parsed.APP_ENV).toBe('staging');
  });
});
