import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  S3_ENDPOINT: z.url(),
  BILLING_PROVIDER: z.enum(['stripe', 'satispay']).default('stripe'),
  BILLING_WEBHOOK_SECRET: z.string().min(1),
  SEARCH_PROVIDER: z.enum(['meilisearch']).default('meilisearch'),
  MEILISEARCH_URL: z.url(),
  MEILISEARCH_API_KEY: z.string().min(1),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional()
});

export type RuntimeEnv = z.infer<typeof envSchema>;

export function parseEnv(input: Record<string, string | undefined>): RuntimeEnv {
  return envSchema.parse(input);
}
