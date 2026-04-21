import type { PlanCode, Subscription } from '@saasflix/domain-billing';
import { isEntitlementEligible } from '@saasflix/domain-billing';

export type Capability =
  | 'apps.stable'
  | 'apps.beta'
  | 'apps.experimental'
  | 'community.standard'
  | 'community.founder_circle'
  | 'support.priority';

export interface EntitlementGrant {
  readonly capability: Capability;
  readonly source: 'plan' | 'override' | 'experiment';
  readonly expiresAt?: string;
}

export interface EntitlementResolutionInput {
  readonly subscription: Subscription;
  readonly overrides: readonly EntitlementGrant[];
  readonly experiments: readonly EntitlementGrant[];
}

const planCapabilities: Record<PlanCode, readonly Capability[]> = {
  base: ['apps.stable', 'community.standard'],
  pro: ['apps.stable', 'apps.beta', 'community.standard', 'support.priority'],
  ultra: ['apps.stable', 'apps.beta', 'apps.experimental', 'community.standard', 'community.founder_circle', 'support.priority']
};

export function resolveEntitlements(input: EntitlementResolutionInput, atIso: string): readonly EntitlementGrant[] {
  if (!isEntitlementEligible(input.subscription.status)) {
    return [];
  }

  const now = Date.parse(atIso);
  const map = new Map<Capability, EntitlementGrant>();

  for (const capability of planCapabilities[input.subscription.plan]) {
    map.set(capability, { capability, source: 'plan' });
  }

  for (const grant of [...input.overrides, ...input.experiments]) {
    if (grant.expiresAt !== undefined) {
      const expiresAt = Date.parse(grant.expiresAt);
      if (Number.isFinite(now) && Number.isFinite(expiresAt) && expiresAt <= now) {
        continue;
      }
    }

    map.set(grant.capability, grant);
  }

  return Array.from(map.values());
}

export function hasCapability(grants: readonly EntitlementGrant[], capability: Capability): boolean {
  return grants.some((grant) => grant.capability === capability);
}
