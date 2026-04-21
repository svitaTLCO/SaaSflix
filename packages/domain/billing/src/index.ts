export type PlanCode = 'base' | 'pro' | 'ultra';

export type SubscriptionStatus =
  | 'incomplete'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

export interface Subscription {
  readonly subscriptionId: string;
  readonly userId: string;
  readonly plan: PlanCode;
  readonly status: SubscriptionStatus;
  readonly periodStartAt: string;
  readonly periodEndAt: string;
  readonly cancelAtPeriodEnd: boolean;
  readonly canceledAt?: string;
}

export type BillingWebhookType =
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.canceled'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed';

export interface BillingWebhookEvent {
  readonly providerEventId: string;
  readonly type: BillingWebhookType;
  readonly occurredAt: string;
  readonly subscriptionId: string;
  readonly userId: string;
  readonly nextPlan?: PlanCode;
  readonly nextStatus?: SubscriptionStatus;
}

export interface WebhookTransitionResult {
  readonly ignoredAsDuplicate: boolean;
  readonly updatedSubscription: Subscription | null;
  readonly reason: 'duplicate_event' | 'applied' | 'invalid_transition';
}

function canTransition(from: SubscriptionStatus, to: SubscriptionStatus): boolean {
  if (from === to) {
    return true;
  }

  const transitionGraph: Record<SubscriptionStatus, readonly SubscriptionStatus[]> = {
    incomplete: ['trialing', 'active', 'canceled'],
    trialing: ['active', 'past_due', 'canceled'],
    active: ['past_due', 'canceled', 'paused'],
    past_due: ['active', 'canceled', 'unpaid'],
    canceled: [],
    unpaid: ['active', 'canceled'],
    paused: ['active', 'canceled']
  };

  return transitionGraph[from].includes(to);
}

export function applyBillingWebhookEvent(
  current: Subscription,
  event: BillingWebhookEvent,
  processedProviderEventIds: ReadonlySet<string>
): WebhookTransitionResult {
  if (processedProviderEventIds.has(event.providerEventId)) {
    return {
      ignoredAsDuplicate: true,
      updatedSubscription: null,
      reason: 'duplicate_event'
    };
  }

  const nextPlan = event.nextPlan ?? current.plan;
  const nextStatus = event.nextStatus ?? current.status;

  if (!canTransition(current.status, nextStatus)) {
    return {
      ignoredAsDuplicate: false,
      updatedSubscription: null,
      reason: 'invalid_transition'
    };
  }

  const updatedSubscription: Subscription = {
    ...current,
    plan: nextPlan,
    status: nextStatus,
    ...(nextStatus === 'canceled' ? { canceledAt: event.occurredAt } : current.canceledAt !== undefined ? { canceledAt: current.canceledAt } : {})
  };

  return {
    ignoredAsDuplicate: false,
    updatedSubscription,
    reason: 'applied'
  };
}

export function isEntitlementEligible(status: SubscriptionStatus): boolean {
  return status === 'trialing' || status === 'active';
}
