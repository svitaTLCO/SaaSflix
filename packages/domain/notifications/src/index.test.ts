import { describe, expect, it } from 'vitest';
import { markNotificationRead, shouldDeliver, type NotificationEvent, type NotificationPreference } from './index';

const pref: NotificationPreference = {
  userId: 'u1',
  topic: 'reply',
  channels: ['in_app', 'email'],
  muted: false
};

const event: NotificationEvent = {
  notificationId: 'n1',
  userId: 'u1',
  topic: 'reply',
  createdAt: '2026-04-21T00:00:00.000Z',
  title: 'New reply',
  body: 'Someone replied to your thread.'
};

describe('notifications domain', () => {
  it('respects preference channels', () => {
    expect(shouldDeliver(pref, 'reply', 'email')).toBe(true);
    expect(shouldDeliver(pref, 'drop', 'email')).toBe(false);
  });

  it('defaults to in-app delivery when preference missing', () => {
    expect(shouldDeliver(null, 'drop', 'in_app')).toBe(true);
    expect(shouldDeliver(null, 'drop', 'email')).toBe(false);
  });

  it('marks notifications read with valid timestamp', () => {
    expect(markNotificationRead(event, '2026-04-22T00:00:00.000Z')?.readAt).toBe('2026-04-22T00:00:00.000Z');
    expect(markNotificationRead(event, 'invalid')).toBeNull();
  });
});
