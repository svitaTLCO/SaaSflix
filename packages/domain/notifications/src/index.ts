export type NotificationTopic = 'drop' | 'reply' | 'mention' | 'support_change' | 'followed_app_update' | 'founder_post';
export type NotificationChannel = 'in_app' | 'email';

export interface NotificationPreference {
  readonly userId: string;
  readonly topic: NotificationTopic;
  readonly channels: readonly NotificationChannel[];
  readonly muted: boolean;
}

export interface NotificationEvent {
  readonly notificationId: string;
  readonly userId: string;
  readonly topic: NotificationTopic;
  readonly createdAt: string;
  readonly title: string;
  readonly body: string;
  readonly readAt?: string;
}

export function shouldDeliver(preference: NotificationPreference | null, topic: NotificationTopic, channel: NotificationChannel): boolean {
  if (preference === null) {
    return channel === 'in_app';
  }

  return !preference.muted && preference.topic === topic && preference.channels.includes(channel);
}

export function markNotificationRead(event: NotificationEvent, readAt: string): NotificationEvent | null {
  if (Number.isNaN(Date.parse(readAt))) {
    return null;
  }
  return { ...event, readAt };
}
