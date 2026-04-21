import { z } from 'zod';

const runtimeEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(['local', 'preview', 'integration', 'staging', 'production']).default('local'),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  S3_ENDPOINT: z.url(),
  BILLING_PROVIDER: z.enum(['stripe', 'satispay']).default('stripe'),
  BILLING_WEBHOOK_SECRET: z.string().min(1),
  SEARCH_PROVIDER: z.enum(['meilisearch']).default('meilisearch'),
  MEILISEARCH_URL: z.url(),
  MEILISEARCH_API_KEY: z.string().min(1),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
  WEB_BASE_URL: z.url().optional(),
  ADMIN_BASE_URL: z.url().optional()
});

const stagingEnvSchema = runtimeEnvSchema
  .extend({
    NODE_ENV: z.literal('production'),
    APP_ENV: z.enum(['staging', 'production']),
    WEB_BASE_URL: z.url(),
    ADMIN_BASE_URL: z.url(),
    OTEL_EXPORTER_OTLP_ENDPOINT: z.url()
  })
  .refine((env) => env.WEB_BASE_URL !== env.ADMIN_BASE_URL, {
    message: 'WEB_BASE_URL and ADMIN_BASE_URL must be different for isolated routing surfaces.'
  });

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;
export type StagingRuntimeEnv = z.infer<typeof stagingEnvSchema>;

export function parseEnv(input: Record<string, string | undefined>): RuntimeEnv {
  return runtimeEnvSchema.parse(input);
}

export function parseStagingEnv(input: Record<string, string | undefined>): StagingRuntimeEnv {
  return stagingEnvSchema.parse(input);
}
