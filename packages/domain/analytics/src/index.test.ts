import { describe, expect, it } from 'vitest';

import { bucketByEventType, validateUsageEvent, type UsageEvent } from './index';

const events: UsageEvent[] = [
  {
    eventId: 'e1',
    userId: 'u1',
    eventType: 'app_opened',
    occurredAt: '2026-04-21T00:00:00.000Z',
    metadata: { appId: 'a1' }
  },
  {
    eventId: 'e2',
    userId: 'u1',
    eventType: 'release_viewed',
    occurredAt: '2026-04-21T00:10:00.000Z',
    metadata: { releaseId: 'r1' }
  }
];

describe('analytics domain', () => {
  it('validates usage events with proper timestamps', () => {
    const firstEvent = events[0];
    if (firstEvent === undefined) {
      throw new Error('expected fixture event');
    }

    expect(validateUsageEvent(firstEvent)).toBe(true);
    expect(validateUsageEvent({ ...firstEvent, occurredAt: 'bad' })).toBe(false);
  });

  it('buckets usage events by event type', () => {
    const bucketed = bucketByEventType(events);
    expect(bucketed.app_opened).toBe(1);
    expect(bucketed.release_viewed).toBe(1);
  });
});
