export type UsageEventType =
  | 'app_opened'
  | 'release_viewed'
  | 'feed_post_viewed'
  | 'discussion_participated'
  | 'support_case_opened'
  | 'notification_clicked';

export interface UsageEvent {
  readonly eventId: string;
  readonly userId: string;
  readonly eventType: UsageEventType;
  readonly occurredAt: string;
  readonly metadata: Record<string, string>;
}

export function validateUsageEvent(event: UsageEvent): boolean {
  return !Number.isNaN(Date.parse(event.occurredAt)) && event.eventId.length > 0 && event.userId.length > 0;
}

export function bucketByEventType(events: readonly UsageEvent[]): Record<UsageEventType, number> {
  const initial: Record<UsageEventType, number> = {
    app_opened: 0,
    release_viewed: 0,
    feed_post_viewed: 0,
    discussion_participated: 0,
    support_case_opened: 0,
    notification_clicked: 0
  };

  for (const event of events) {
    initial[event.eventType] += 1;
  }

  return initial;
}
