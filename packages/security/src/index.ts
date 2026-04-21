import type { AccountRole, MemberPlan, UserAccount } from '@saasflix/domain-identity';
import { hasRole } from '@saasflix/domain-identity';

export type PlatformSurface = 'public' | 'member' | 'admin';

export type ProtectedAction =
  | 'registry.write'
  | 'release.publish'
  | 'support.moderate'
  | 'session.revoke.self'
  | 'session.revoke.any'
  | 'billing.manage'
  | 'discussion.moderate';

export interface AuthContext {
  readonly actor: UserAccount | null;
  readonly ownedUserId?: string;
}

const minimumPlanForAction: Record<ProtectedAction, MemberPlan> = {
  'registry.write': 'pro',
  'release.publish': 'pro',
  'support.moderate': 'base',
  'session.revoke.self': 'base',
  'session.revoke.any': 'base',
  'billing.manage': 'base',
  'discussion.moderate': 'base'
};

function meetsPlan(actual: MemberPlan, required: MemberPlan): boolean {
  const rank: Record<MemberPlan, number> = { base: 1, pro: 2, ultra: 3 };
  return rank[actual] >= rank[required];
}

function canPerformPrivilegedAction(actor: UserAccount, roles: readonly AccountRole[]): boolean {
  return roles.some((role) => hasRole(actor, role));
}

export function assertSurfaceAccess(actor: UserAccount | null, surface: PlatformSurface): boolean {
  if (surface === 'public') {
    return true;
  }

  if (actor === null) {
    return false;
  }

  if (surface === 'admin') {
    return hasRole(actor, 'admin') || hasRole(actor, 'founder');
  }

  return true;
}

export function authorizeAction(context: AuthContext, action: ProtectedAction): boolean {
  const actor = context.actor;

  if (actor === null) {
    return false;
  }

  if (!meetsPlan(actor.plan, minimumPlanForAction[action])) {
    return false;
  }

  switch (action) {
    case 'registry.write':
    case 'release.publish':
      return canPerformPrivilegedAction(actor, ['admin', 'founder']);
    case 'support.moderate':
    case 'discussion.moderate':
      return canPerformPrivilegedAction(actor, ['moderator', 'admin', 'founder', 'support']);
    case 'session.revoke.any':
      return canPerformPrivilegedAction(actor, ['admin', 'founder', 'support']);
    case 'session.revoke.self':
      return context.ownedUserId === actor.userId;
    case 'billing.manage':
      return context.ownedUserId === actor.userId || canPerformPrivilegedAction(actor, ['admin', 'founder', 'support']);
    default:
      return false;
  }
}
