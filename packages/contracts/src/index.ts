import { z } from 'zod';

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    traceId: z.string()
  })
});

export const domainEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string().min(1),
  aggregateId: z.string().min(1),
  occurredAt: z.string().datetime(),
  version: z.number().int().positive(),
  idempotencyKey: z.string().min(1),
  traceId: z.string().min(1),
  payload: z.record(z.string(), z.unknown())
});

export const sessionIssueRequestSchema = z.object({
  userId: z.string().uuid(),
  deviceLabel: z.string().min(1),
  ipHash: z.string().min(1),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime()
});

export const sessionRevokeRequestSchema = z.object({
  sessionId: z.string().uuid(),
  reason: z.enum(['user_self_revoke', 'security_event', 'admin_action']),
  revokedAt: z.string().datetime()
});

export type DomainEvent = z.infer<typeof domainEventSchema>;
export type SessionIssueRequest = z.infer<typeof sessionIssueRequestSchema>;
export type SessionRevokeRequest = z.infer<typeof sessionRevokeRequestSchema>;
