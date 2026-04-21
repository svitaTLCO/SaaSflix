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

export const billingWebhookPayloadSchema = z.object({
  providerEventId: z.string().min(1),
  receivedAt: z.string().datetime(),
  signature: z.string().min(1),
  body: z.record(z.string(), z.unknown())
});

export const providerWebhookReceiptSchema = z.object({
  providerEventId: z.string().min(1),
  provider: z.enum(['stripe', 'satispay']),
  processedAt: z.string().datetime()
});

export type DomainEvent = z.infer<typeof domainEventSchema>;
export type SessionIssueRequest = z.infer<typeof sessionIssueRequestSchema>;
export type SessionRevokeRequest = z.infer<typeof sessionRevokeRequestSchema>;
export type BillingWebhookPayload = z.infer<typeof billingWebhookPayloadSchema>;
export type ProviderWebhookReceipt = z.infer<typeof providerWebhookReceiptSchema>;

export const appLifecycleStatusSchema = z.enum([
  'concept',
  'in_development',
  'private_beta',
  'public_beta',
  'stable',
  'experimental',
  'deprecated',
  'archived'
]);

export const appAvailabilitySchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('included_from_plan'), minimumPlan: z.enum(['base', 'pro', 'ultra']) }),
  z.object({ kind: z.literal('invite_only') }),
  z.object({ kind: z.literal('founder_circle_only') }),
  z
    .object({
      kind: z.literal('time_limited_experiment'),
      startsAt: z.string().datetime(),
      endsAt: z.string().datetime()
    })
    .refine((entry) => Date.parse(entry.startsAt) < Date.parse(entry.endsAt), {
      message: 'time_limited_experiment window must have startsAt before endsAt'
    })
]);

export const appRecordSchema = z.object({
  appId: z.string().min(1),
  slug: z.string().min(1),
  publicName: z.string().min(1),
  shortThesis: z.string().min(1),
  lifecycleStatus: appLifecycleStatusSchema,
  visibility: z.enum(['public', 'member', 'admin_only']),
  availability: appAvailabilitySchema,
  integrationType: z.enum([
    'native_module',
    'embedded_experience',
    'external_web_app',
    'downloadable_native_app',
    'installable_companion',
    'prototype_surface'
  ]),
  launchUrl: z.string().url().refine((url) => url.startsWith('https://'), {
    message: 'launchUrl must use HTTPS'
  }),
  createdAt: z.string().datetime(),
  publishedAt: z.string().datetime().optional(),
  archivedAt: z.string().datetime().optional()
});

export const appReleaseSchema = z
  .object({
  releaseId: z.string().min(1),
  appId: z.string().min(1),
  versionLabel: z.string().min(1),
  summary: z.string().min(1),
  releaseNotesMarkdown: z.string().min(1),
  releaseType: z.enum([
    'launch',
    'major_update',
    'minor_update',
    'beta_drop',
    'experimental_drop',
    'deprecation_notice',
    'archive_notice'
  ]),
  publicationState: z.enum(['draft', 'scheduled', 'published', 'withdrawn']),
  createdAt: z.string().datetime(),
  scheduledFor: z.string().datetime().optional(),
  publishedAt: z.string().datetime().optional(),
  withdrawnAt: z.string().datetime().optional()
  })
  .refine((release) => (release.scheduledFor === undefined ? true : Date.parse(release.scheduledFor) >= Date.parse(release.createdAt)), {
    message: 'scheduledFor must be on or after createdAt'
  })
  .refine((release) => (release.publishedAt === undefined ? true : Date.parse(release.publishedAt) >= Date.parse(release.createdAt)), {
    message: 'publishedAt must be on or after createdAt'
  });

export type AppRecordContract = z.infer<typeof appRecordSchema>;
export type AppReleaseContract = z.infer<typeof appReleaseSchema>;

export const feedPostSchema = z
  .object({
    postId: z.string().min(1),
    authorUserId: z.string().uuid(),
    title: z.string().min(1),
    bodyMarkdown: z.string().min(1),
    visibility: z.enum(['public', 'member']),
    state: z.enum(['draft', 'scheduled', 'published', 'archived']),
    createdAt: z.string().datetime(),
    scheduledFor: z.string().datetime().optional(),
    publishedAt: z.string().datetime().optional(),
    archivedAt: z.string().datetime().optional()
  })
  .refine((post) => !post.bodyMarkdown.toLowerCase().includes('<script'), {
    message: 'bodyMarkdown must not include script tags'
  })
  .refine((post) => !post.bodyMarkdown.toLowerCase().includes('javascript:'), {
    message: 'bodyMarkdown must not include javascript protocol URLs'
  });

export type FeedPostContract = z.infer<typeof feedPostSchema>;

export const discussionThreadSchema = z
  .object({
    threadId: z.string().min(1),
    threadType: z.enum([
      'release_discussion',
      'product_feedback',
      'support_question',
      'roadmap_discussion',
      'founder_post_discussion',
      'announcement_thread',
      'known_issue_thread'
    ]),
    title: z.string().min(1),
    bodyMarkdown: z.string().min(1),
    authorUserId: z.string().uuid(),
    visibility: z.enum(['public', 'member', 'app_member', 'staff_private', 'founder_circle']),
    moderationState: z.enum(['open', 'locked', 'hidden', 'archived']),
    createdAt: z.string().datetime(),
    appId: z.string().min(1).optional(),
    releaseId: z.string().min(1).optional(),
    founderPostId: z.string().min(1).optional(),
    supportCaseId: z.string().min(1).optional()
  })
  .refine((thread) => !thread.bodyMarkdown.toLowerCase().includes('<script'), {
    message: 'bodyMarkdown must not include script tags'
  })
  .refine((thread) => !thread.bodyMarkdown.toLowerCase().includes('javascript:'), {
    message: 'bodyMarkdown must not include javascript protocol URLs'
  });

export type DiscussionThreadContract = z.infer<typeof discussionThreadSchema>;

export const supportCaseSchema = z.object({
  caseId: z.string().min(1),
  requesterUserId: z.string().uuid(),
  appId: z.string().min(1).optional(),
  releaseId: z.string().min(1).optional(),
  subject: z.string().min(1),
  bodyMarkdown: z.string().min(1),
  visibility: z.enum(['staff_private', 'member_private', 'member_shared']),
  state: z.enum(['open', 'under_review', 'waiting_customer', 'answered', 'escalated', 'resolved', 'closed']),
  createdAt: z.string().datetime(),
  resolvedAt: z.string().datetime().optional(),
  acceptedAnswerCommentId: z.string().min(1).optional()
});

export const notificationEventSchema = z.object({
  notificationId: z.string().min(1),
  userId: z.string().uuid(),
  topic: z.enum(['drop', 'reply', 'mention', 'support_change', 'followed_app_update', 'founder_post']),
  createdAt: z.string().datetime(),
  title: z.string().min(1),
  body: z.string().min(1),
  readAt: z.string().datetime().optional()
});

export const mediaAssetSchema = z.object({
  assetId: z.string().min(1),
  ownerUserId: z.string().uuid(),
  kind: z.enum(['image', 'video', 'document']),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().positive(),
  storageKey: z.string().min(1),
  createdAt: z.string().datetime()
});

export const searchDocumentSchema = z.object({
  id: z.string().min(1),
  entityType: z.enum(['app', 'release', 'post', 'discussion', 'support_article']),
  title: z.string().min(1),
  body: z.string().min(1),
  tags: z.array(z.string()),
  publishedAt: z.string().datetime().optional()
});

export const usageEventSchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().uuid(),
  eventType: z.enum(['app_opened', 'release_viewed', 'feed_post_viewed', 'discussion_participated', 'support_case_opened', 'notification_clicked']),
  occurredAt: z.string().datetime(),
  metadata: z.record(z.string(), z.string())
});

export type SupportCaseContract = z.infer<typeof supportCaseSchema>;
export type NotificationEventContract = z.infer<typeof notificationEventSchema>;
export type MediaAssetContract = z.infer<typeof mediaAssetSchema>;
export type SearchDocumentContract = z.infer<typeof searchDocumentSchema>;
export type UsageEventContract = z.infer<typeof usageEventSchema>;
