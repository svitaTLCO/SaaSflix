import { assertSurfaceAccess } from '@saasflix/security';
import type { UserAccount } from '@saasflix/domain-identity';

const exampleMember: UserAccount = {
  userId: '22222222-2222-2222-2222-222222222222',
  email: 'member@saasflix.local',
  roles: ['member'],
  plan: 'base',
  mfaEnabled: false
};

export default function MemberHomePage(): JSX.Element {
  const allowed = assertSurfaceAccess(exampleMember, 'member');

  return <main>{allowed ? 'Member shell home (M1 authz scaffold).' : 'Sign-in required.'}</main>;
}
